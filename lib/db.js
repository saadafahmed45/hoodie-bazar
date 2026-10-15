import { MongoClient, ObjectId } from "mongodb";
let lastConnectionError = null;

export function getLastDbError() {
  return { lastConnectionError };
}
import { SAMPLE_PRODUCTS } from "./sample-data";
import { CATEGORIES as INITIAL_CATEGORIES } from "./constants";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "hoodiee_bazar_db132";

const clientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
};

let client = null;
let clientPromise = null;
let isDbSeeded = false;

// Global fallback in-memory store if MongoDB is not connected
let memoryProducts = JSON.parse(JSON.stringify(SAMPLE_PRODUCTS));
let memoryCategories = INITIAL_CATEGORIES.map((c, i) => ({
  _id: `cat-${i + 1}`,
  ...c,
  createdAt: new Date().toISOString(),
}));
let memoryOrders = [];

// Helper to convert ID strings to ObjectId if valid 24-hex string, else preserve raw string
export function toMongoQueryId(id) {
  if (!id) return null;
  const str = String(id).trim();
  if (ObjectId && ObjectId.isValid(str)) {
    try {
      const objId = new ObjectId(str);
      if (objId.toString() === str) {
        return objId;
      }
    } catch {
      // Return raw string if ObjectId constructor fails
    }
  }
  return str;
}

export async function getDb() {
  const currentUri = process.env.MONGODB_URI || uri;
  const currentDbName = process.env.MONGODB_DB || dbName;

  if (!currentUri) {
    return null;
  }

  try {
    if (!clientPromise) {
      if (process.env.NODE_ENV === "development") {
        if (!global._mongoClientPromise) {
          client = new MongoClient(currentUri, clientOptions);
          global._mongoClientPromise = client.connect();
        }
        clientPromise = global._mongoClientPromise;
      } else {
        if (!global._mongoClientPromise) {
          client = new MongoClient(currentUri, clientOptions);
          global._mongoClientPromise = client.connect();
        }
        clientPromise = global._mongoClientPromise;
      }
    }

    const connectedClient = await clientPromise;
    return connectedClient.db(currentDbName);
  } catch (err) {
    lastConnectionError = err.message || String(err);
    console.error("[MongoDB] Connection warning, using fallback memory storage:", err.message);
    // Reset so subsequent requests can retry fresh instead of being stuck with a rejected promise
    clientPromise = null;
    if (global._mongoClientPromise) {
      delete global._mongoClientPromise;
    }
    return null;
  }
}

// Ensure database has initial sample products and categories seeded if empty
export async function ensureDbSeeded() {
  if (isDbSeeded) return;
  const db = await getDb();
  if (!db) return;

  try {
    const count = await db.collection("products").countDocuments();
    if (count === 0) {
      const docsToInsert = SAMPLE_PRODUCTS.map((p) => {
        const { _id, ...rest } = p;
        return {
          ...rest,
          createdAt: new Date(p.createdAt || Date.now()),
        };
      });
      await db.collection("products").insertMany(docsToInsert);
      console.log("Seeded database with initial products.");
    }

    const catCount = await db.collection("categories").countDocuments();
    if (catCount === 0) {
      const catsToInsert = INITIAL_CATEGORIES.map((c) => ({
        ...c,
        createdAt: new Date(),
      }));
      await db.collection("categories").insertMany(catsToInsert);
      console.log("Seeded database with initial categories.");
    } else {
      // Clean up any duplicate categories in database
      const allCats = await db.collection("categories").find({}).toArray();
      const seenSlugs = new Set();
      const duplicateIds = [];
      for (const cat of allCats) {
        const slug = (cat.slug || cat.name).toLowerCase();
        if (seenSlugs.has(slug)) {
          duplicateIds.push(cat._id);
        } else {
          seenSlugs.add(slug);
        }
      }
      if (duplicateIds.length > 0) {
        await db.collection("categories").deleteMany({ _id: { $in: duplicateIds } });
        console.log(`Cleaned up ${duplicateIds.length} duplicate categories.`);
      }
    }
    isDbSeeded = true;
  } catch (error) {
    console.error("Error seeding MongoDB:", error);
  }
}

// Product helpers
export async function getProducts(filter = {}, sort = { createdAt: -1 }) {
  const db = await getDb();
  if (db) {
    await ensureDbSeeded();
    const query = {};
    if (filter.category && filter.category !== "All") {
      const base = filter.category.replace(/s$/i, "");
      query.category = { $regex: new RegExp(`^${base}s?$`, "i") };
    }
    if (filter.newArrival) {
      query.newArrival = true;
    }
    if (filter.featured) {
      query.featured = true;
    }
    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: "i" } },
        { category: { $regex: filter.search, $options: "i" } },
        { description: { $regex: filter.search, $options: "i" } },
      ];
    }
    if (filter.minPrice || filter.maxPrice) {
      query.price = {};
      if (filter.minPrice) query.price.$gte = Number(filter.minPrice);
      if (filter.maxPrice) query.price.$lte = Number(filter.maxPrice);
    }

    const items = await db.collection("products").find(query).sort(sort).toArray();
    return items.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));
  }

  // Memory fallback
  let list = [...memoryProducts];
  if (filter.category && filter.category !== "All") {
    const target = filter.category.toLowerCase().replace(/s$/, "");
    list = list.filter((p) => {
      const pCat = (p.category || "").toLowerCase().replace(/s$/, "");
      return pCat === target || (p.category || "").toLowerCase() === filter.category.toLowerCase();
    });
  }
  if (filter.newArrival) {
    list = list.filter((p) => p.newArrival === true);
  }
  if (filter.featured) {
    list = list.filter((p) => p.featured === true);
  }
  if (filter.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }
  if (filter.minPrice) {
    list = list.filter((p) => p.price >= Number(filter.minPrice));
  }
  if (filter.maxPrice) {
    list = list.filter((p) => p.price <= Number(filter.maxPrice));
  }

  if (sort.price === 1) {
    list.sort((a, b) => a.price - b.price);
  } else if (sort.price === -1) {
    list.sort((a, b) => b.price - a.price);
  } else {
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  return list;
}

export async function getProductBySlug(slug) {
  const db = await getDb();
  if (db) {
    await ensureDbSeeded();
    const doc = await db.collection("products").findOne({ slug });
    if (!doc) return null;
    return { ...doc, _id: doc._id.toString() };
  }
  return memoryProducts.find((p) => p.slug === slug) || null;
}

export async function getProductById(id) {
  const db = await getDb();
  if (db) {
    try {
      const qId = toMongoQueryId(id);
      const query = { _id: qId };
      const doc = await db.collection("products").findOne(query);
      if (!doc) return null;
      return { ...doc, _id: doc._id.toString() };
    } catch {
      return null;
    }
  }
  return memoryProducts.find((p) => p._id === id) || null;
}

export async function createProduct(productData) {
  const db = await getDb();
  const newProduct = {
    ...productData,
    createdAt: new Date(),
  };

  if (db) {
    const result = await db.collection("products").insertOne(newProduct);
    return { ...newProduct, _id: result.insertedId.toString() };
  }

  const generatedId = "prod-" + Date.now();
  const created = { ...newProduct, _id: generatedId };
  memoryProducts.unshift(created);
  return created;
}

export async function updateProduct(id, updateData) {
  const db = await getDb();
  if (db) {
    const qId = toMongoQueryId(id);
    const { _id, ...safeUpdates } = updateData;
    await db.collection("products").updateOne({ _id: qId }, { $set: safeUpdates });
    return getProductById(id);
  }

  const index = memoryProducts.findIndex((p) => p._id === id);
  if (index === -1) return null;
  memoryProducts[index] = { ...memoryProducts[index], ...updateData };
  return memoryProducts[index];
}

export async function deleteProduct(id) {
  const db = await getDb();
  if (db) {
    const qId = toMongoQueryId(id);
    const res = await db.collection("products").deleteOne({ _id: qId });
    return res.deletedCount > 0;
  }
  const initialLength = memoryProducts.length;
  memoryProducts = memoryProducts.filter((p) => p._id !== id);
  return memoryProducts.length < initialLength;
}

export async function deleteManyProducts(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const db = await getDb();
  if (db) {
    const queryIds = ids.map(toMongoQueryId).filter(Boolean);
    if (queryIds.length === 0) return 0;
    const res = await db.collection("products").deleteMany({ _id: { $in: queryIds } });
    return res.deletedCount || 0;
  }
  const idSet = new Set(ids);
  const initialLength = memoryProducts.length;
  memoryProducts = memoryProducts.filter((p) => !idSet.has(p._id));
  return initialLength - memoryProducts.length;
}

export async function updateManyProducts(ids, updates) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const db = await getDb();
  if (db) {
    const queryIds = ids.map(toMongoQueryId).filter(Boolean);
    if (queryIds.length === 0) return 0;
    const res = await db.collection("products").updateMany({ _id: { $in: queryIds } }, { $set: updates });
    return res.modifiedCount || 0;
  }
  const idSet = new Set(ids);
  let count = 0;
  memoryProducts = memoryProducts.map((p) => {
    if (idSet.has(p._id)) {
      count++;
      return { ...p, ...updates };
    }
    return p;
  });
  return count;
}

// Generate an 8-character unique order ID (e.g. "NV7K9P2X")
export function generateOrderId() {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let code = "NV";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Order helpers
export async function createOrder(orderData) {
  const db = await getDb();
  const orderId = orderData.orderId || generateOrderId();
  const newOrder = {
    ...orderData,
    _id: orderId,
    orderId: orderId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (db) {
    try {
      await db.collection("orders").insertOne(newOrder);
      return newOrder;
    } catch (err) {
      if (err.code === 11000) {
        const freshId = generateOrderId();
        newOrder._id = freshId;
        newOrder.orderId = freshId;
        await db.collection("orders").insertOne(newOrder);
        return newOrder;
      }
      throw err;
    }
  }

  memoryOrders.unshift(newOrder);
  return newOrder;
}

export async function getOrders() {
  const db = await getDb();
  if (db) {
    const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray();
    return orders.map((o) => ({
      ...o,
      _id: o._id.toString(),
      orderId: o.orderId || o._id.toString(),
    }));
  }
  return [...memoryOrders];
}

export async function getOrderById(id) {
  if (!id) return null;
  const trimmed = String(id).trim();
  const upper = trimmed.toUpperCase();
  const db = await getDb();

  if (db) {
    try {
      const qId = toMongoQueryId(trimmed);
      const query = {
        $or: [
          { orderId: upper },
          { orderId: trimmed },
          { _id: upper },
          { _id: trimmed },
          { _id: qId },
        ],
      };

      const doc = await db.collection("orders").findOne(query);
      if (!doc) return null;
      return {
        ...doc,
        _id: doc._id.toString(),
        orderId: doc.orderId || doc._id.toString(),
      };
    } catch (err) {
      console.error("getOrderById error:", err);
      return null;
    }
  }

  return (
    memoryOrders.find(
      (o) =>
        (o.orderId && o.orderId.toUpperCase() === upper) ||
        (o._id && String(o._id).toUpperCase() === upper) ||
        o._id === trimmed
    ) || null
  );
}

export async function updateOrderStatus(id, status) {
  if (!id) return null;
  const trimmed = String(id).trim();
  const upper = trimmed.toUpperCase();
  const db = await getDb();

  if (db) {
    try {
      const qId = toMongoQueryId(trimmed);
      const query = {
        $or: [
          { orderId: upper },
          { orderId: trimmed },
          { _id: upper },
          { _id: trimmed },
          { _id: qId },
        ],
      };
      await db.collection("orders").updateOne(query, {
        $set: { status, updatedAt: new Date() },
      });
      return getOrderById(id);
    } catch (err) {
      console.error("updateOrderStatus error:", err);
      return null;
    }
  }

  const index = memoryOrders.findIndex(
    (o) =>
      (o.orderId && o.orderId.toUpperCase() === upper) ||
      (o._id && String(o._id).toUpperCase() === upper) ||
      o._id === trimmed
  );
  if (index === -1) return null;
  memoryOrders[index].status = status;
  memoryOrders[index].updatedAt = new Date();
  return memoryOrders[index];
}

export async function deleteOrder(id) {
  if (!id) return false;
  const trimmed = String(id).trim();
  const upper = trimmed.toUpperCase();
  const db = await getDb();

  if (db) {
    try {
      const qId = toMongoQueryId(trimmed);
      const query = {
        $or: [
          { orderId: upper },
          { orderId: trimmed },
          { _id: upper },
          { _id: trimmed },
          { _id: qId },
        ],
      };
      const res = await db.collection("orders").deleteOne(query);
      return res.deletedCount > 0;
    } catch (err) {
      console.error("deleteOrder error:", err);
      return false;
    }
  }

  const idx = memoryOrders.findIndex(
    (o) =>
      (o.orderId && o.orderId.toUpperCase() === upper) ||
      (o._id && String(o._id).toUpperCase() === upper) ||
      o._id === trimmed
  );
  if (idx !== -1) {
    memoryOrders.splice(idx, 1);
    return true;
  }
  return false;
}

export async function getOrdersByCustomer({ email, phone, userId } = {}) {
  const db = await getDb();
  const orConditions = [];

  if (email && typeof email === "string" && email.trim()) {
    orConditions.push({ "customer.email": email.trim().toLowerCase() });
  }
  if (phone && typeof phone === "string" && phone.trim()) {
    orConditions.push({ "customer.phone": phone.trim() });
  }
  if (userId && typeof userId === "string" && userId.trim()) {
    orConditions.push({ "customer.userId": userId.trim() });
  }

  if (orConditions.length === 0) return [];

  if (db) {
    const orders = await db
      .collection("orders")
      .find({ $or: orConditions })
      .sort({ createdAt: -1 })
      .toArray();
    return orders.map((o) => ({ ...o, _id: o._id.toString() }));
  }

  const cleanEmail = email ? email.trim().toLowerCase() : "";
  const cleanPhone = phone ? phone.trim() : "";
  const cleanUserId = userId ? userId.trim() : "";

  return memoryOrders
    .filter((o) => {
      const oEmail = o.customer?.email?.toLowerCase();
      const oPhone = o.customer?.phone;
      const oUserId = o.customer?.userId;
      if (cleanEmail && oEmail === cleanEmail) return true;
      if (cleanPhone && oPhone === cleanPhone) return true;
      if (cleanUserId && oUserId === cleanUserId) return true;
      return false;
    })
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

// Category helpers
export async function getCategories() {
  const db = await getDb();
  if (db) {
    await ensureDbSeeded();
    const docs = await db.collection("categories").find({}).sort({ name: 1 }).toArray();
    return docs.map((doc) => ({ ...doc, _id: doc._id.toString() }));
  }
  return [...memoryCategories].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCategoryById(id) {
  const db = await getDb();
  if (db) {
    try {
      const qId = toMongoQueryId(id);
      const doc = await db.collection("categories").findOne({ _id: qId });
      if (!doc) return null;
      return { ...doc, _id: doc._id.toString() };
    } catch {
      return null;
    }
  }
  return memoryCategories.find((c) => c._id === id) || null;
}

export async function getCategoryBySlug(slug) {
  const db = await getDb();
  if (db) {
    await ensureDbSeeded();
    const doc = await db.collection("categories").findOne({ slug: slug.toLowerCase() });
    if (!doc) return null;
    return { ...doc, _id: doc._id.toString() };
  }
  return memoryCategories.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function createCategory(categoryData) {
  const db = await getDb();
  const slug = (categoryData.slug || categoryData.name)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const newCategory = {
    name: categoryData.name.trim(),
    slug,
    image: categoryData.image || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    description: categoryData.description || "",
    createdAt: new Date(),
  };

  if (db) {
    const result = await db.collection("categories").insertOne(newCategory);
    return { ...newCategory, _id: result.insertedId.toString() };
  }

  const generatedId = "cat-" + Date.now();
  const created = { ...newCategory, _id: generatedId };
  memoryCategories.push(created);
  return created;
}

export async function updateCategory(id, updateData) {
  const db = await getDb();
  const { _id, ...safeUpdates } = updateData;

  if (safeUpdates.slug) {
    safeUpdates.slug = safeUpdates.slug
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  if (db) {
    const qId = toMongoQueryId(id);
    await db.collection("categories").updateOne({ _id: qId }, { $set: safeUpdates });
    return getCategoryById(id);
  }

  const index = memoryCategories.findIndex((c) => c._id === id);
  if (index === -1) return null;
  memoryCategories[index] = { ...memoryCategories[index], ...safeUpdates };
  return memoryCategories[index];
}

export async function deleteCategory(id) {
  const db = await getDb();
  if (db) {
    const qId = toMongoQueryId(id);
    const res = await db.collection("categories").deleteOne({ _id: qId });
    return res.deletedCount > 0;
  }
  const initialLength = memoryCategories.length;
  memoryCategories = memoryCategories.filter((c) => c._id !== id);
  return memoryCategories.length < initialLength;
}

export async function getCategoriesWithProductCounts() {
  const categories = await getCategories();
  const products = await getProducts();
  return categories.map((cat) => {
    const catBase = (cat.name || "").toLowerCase().replace(/s$/, "");
    const count = products.filter((p) => {
      if (!p.category) return false;
      const pBase = p.category.toLowerCase().replace(/s$/, "");
      return pBase === catBase || p.category.toLowerCase() === (cat.name || "").toLowerCase();
    }).length;
    return { ...cat, productCount: count };
  });
}

// ==========================================
// ADMIN USERS MANAGEMENT (SUPER ADMIN & CUSTOMER MANAGER)
// ==========================================

let memoryAdminUsers = [
  {
    _id: "admin-root",
    name: "Nivora Administrator",
    email: "admin@nivora.com",
    password: "admin1234",
    role: "super_admin",
    status: "active",
    createdAt: new Date("2026-09-01T00:00:00.000Z"),
    lastLogin: new Date().toISOString(),
  },
  {
    _id: "admin-manager",
    name: "Customer Support Manager",
    email: "manager@hoodiebazar.com",
    password: "manager1234",
    role: "customer_manager",
    status: "active",
    createdAt: new Date("2026-10-01T00:00:00.000Z"),
    lastLogin: new Date().toISOString(),
  },
];

let isAdminUsersSeeded = false;

export async function ensureAdminUsersSeeded() {
  if (isAdminUsersSeeded) return;
  const db = await getDb();
  if (!db) return;

  try {
    const count = await db.collection("admin_users").countDocuments();
    if (count === 0) {
      await db.collection("admin_users").insertMany(
        memoryAdminUsers.map((u) => ({
          ...u,
          _id: u._id,
          createdAt: new Date(u.createdAt),
        }))
      );
      console.log("Seeded default admin users in MongoDB.");
    }
    isAdminUsersSeeded = true;
  } catch (error) {
    console.error("Error seeding admin users:", error.message);
  }
}

export async function getAdminUsers() {
  const db = await getDb();
  if (db) {
    await ensureAdminUsersSeeded();
    const users = await db
      .collection("admin_users")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return users.map((u) => {
      const { password, ...safeUser } = u;
      return {
        ...safeUser,
        _id: u._id.toString(),
      };
    });
  }

  return memoryAdminUsers.map((u) => {
    const { password, ...safeUser } = u;
    return safeUser;
  });
}

export async function getAdminUserByEmail(email) {
  if (!email) return null;
  const cleanEmail = email.toLowerCase().trim();
  const db = await getDb();

  if (db) {
    await ensureAdminUsersSeeded();
    const escaped = cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const user = await db
      .collection("admin_users")
      .findOne({
        $or: [
          { email: cleanEmail },
          { email: { $regex: new RegExp(`^${escaped}$`, "i") } },
        ],
      });

    if (!user) return null;
    return { ...user, _id: user._id.toString() };
  }

  return (
    memoryAdminUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    ) || null
  );
}

export async function getAdminUserById(id) {
  if (!id) return null;
  const db = await getDb();

  if (db) {
    const qId = toMongoQueryId(id);
    const user = await db.collection("admin_users").findOne({
      $or: [{ _id: id }, { _id: qId }],
    });
    if (!user) return null;
    const { password, ...safeUser } = user;
    return { ...safeUser, _id: user._id.toString() };
  }

  const found = memoryAdminUsers.find((u) => u._id === id);
  if (!found) return null;
  const { password, ...safeUser } = found;
  return safeUser;
}

export async function createAdminUser(userData) {
  const { name, email, password, role = "customer_manager", status = "active" } = userData;
  const cleanEmail = (email || "").toLowerCase().trim();

  // Check if exists
  const existing = await getAdminUserByEmail(cleanEmail);
  if (existing) {
    throw new Error("An administrative user with this email already exists.");
  }

  const newUser = {
    name: name.trim(),
    email: cleanEmail,
    password: password || "staff1234",
    role: role === "super_admin" ? "super_admin" : "customer_manager",
    status: status === "suspended" ? "suspended" : "active",
    createdAt: new Date(),
    lastLogin: null,
  };

  const db = await getDb();
  if (db) {
    const res = await db.collection("admin_users").insertOne(newUser);
    const { password: _, ...safeUser } = newUser;
    return { ...safeUser, _id: res.insertedId.toString() };
  }

  const generatedId = "admin-" + Date.now();
  const created = { ...newUser, _id: generatedId };
  memoryAdminUsers.push(created);
  const { password: _, ...safeUser } = created;
  return safeUser;
}

export async function updateAdminUser(id, updateData) {
  if (!id) return null;
  const db = await getDb();
  const { _id, email, ...safeUpdates } = updateData;

  if (safeUpdates.role && safeUpdates.role !== "super_admin" && safeUpdates.role !== "customer_manager") {
    safeUpdates.role = "customer_manager";
  }

  safeUpdates.updatedAt = new Date();

  if (db) {
    const qId = toMongoQueryId(id);
    await db.collection("admin_users").updateOne(
      { $or: [{ _id: id }, { _id: qId }] },
      { $set: safeUpdates }
    );
    return getAdminUserById(id);
  }

  const idx = memoryAdminUsers.findIndex((u) => u._id === id);
  if (idx === -1) return null;
  memoryAdminUsers[idx] = { ...memoryAdminUsers[idx], ...safeUpdates };
  const { password: _, ...safeUser } = memoryAdminUsers[idx];
  return safeUser;
}

export async function deleteAdminUser(id) {
  if (!id) return false;
  // Safety check: protect root super admin
  if (id === "admin-root" || id === "admin@nivora.com") {
    throw new Error("Root Super Administrator cannot be deleted.");
  }

  const db = await getDb();
  if (db) {
    const qId = toMongoQueryId(id);
    const res = await db.collection("admin_users").deleteOne({
      $or: [{ _id: id }, { _id: qId }],
    });
    return res.deletedCount > 0;
  }

  const prevLen = memoryAdminUsers.length;
  memoryAdminUsers = memoryAdminUsers.filter((u) => u._id !== id);
  return memoryAdminUsers.length < prevLen;
}

// ==========================================
// CUSTOMER MANAGEMENT (AGGREGATED & MANAGED)
// ==========================================

let memoryCustomerOverrides = {};

export async function getCustomers() {
  const orders = await getOrders();
  const customerMap = new Map();

  // Aggregate customer details from all store orders
  orders.forEach((ord) => {
    const phone = ord.customer?.phone ? String(ord.customer.phone).trim() : "";
    const email = ord.customer?.email ? String(ord.customer.email).toLowerCase().trim() : "";
    const key = phone || email || `guest-${ord._id}`;

    if (!customerMap.has(key)) {
      customerMap.set(key, {
        id: `cust-${key.replace(/[^\w-]/g, "")}`,
        name: ord.customer?.name || "Guest Customer",
        phone: ord.customer?.phone || "N/A",
        email: ord.customer?.email || "N/A",
        district: ord.customer?.district || "Dhaka",
        address: ord.customer?.address || "",
        ordersCount: 0,
        totalSpent: 0,
        orders: [],
        firstOrderDate: ord.createdAt,
        lastOrderDate: ord.createdAt,
        status: "active",
      });
    }

    const c = customerMap.get(key);
    c.ordersCount += 1;
    c.totalSpent += ord.total || 0;
    c.orders.push({
      orderId: ord.orderId || ord._id,
      total: ord.total || 0,
      status: ord.status || "Pending",
      date: ord.createdAt,
      itemsCount: ord.items?.length || 1,
    });

    if (new Date(ord.createdAt) < new Date(c.firstOrderDate)) {
      c.firstOrderDate = ord.createdAt;
    }
    if (new Date(ord.createdAt) > new Date(c.lastOrderDate)) {
      c.lastOrderDate = ord.createdAt;
      // Use latest contact and address info
      if (ord.customer?.name) c.name = ord.customer.name;
      if (ord.customer?.district) c.district = ord.customer.district;
      if (ord.customer?.address) c.address = ord.customer.address;
    }
  });

  // Convert map to sorted array
  const customerList = Array.from(customerMap.values()).map((c) => {
    // Apply custom status override if any
    const override = memoryCustomerOverrides[c.id];
    const status = override?.status || (c.totalSpent >= 2500 ? "VIP" : c.ordersCount > 1 ? "Repeat" : "Active");

    return {
      ...c,
      status,
      notes: override?.notes || "",
    };
  });

  customerList.sort((a, b) => b.totalSpent - a.totalSpent);
  return customerList;
}

export async function updateCustomerStatus(customerId, { status, notes }) {
  if (!customerId) return null;
  memoryCustomerOverrides[customerId] = {
    ...(memoryCustomerOverrides[customerId] || {}),
    ...(status ? { status } : {}),
    ...(notes !== undefined ? { notes } : {}),
    updatedAt: new Date().toISOString(),
  };

  const db = await getDb();
  if (db) {
    await db.collection("customer_meta").updateOne(
      { customerId },
      { $set: memoryCustomerOverrides[customerId] },
      { upsert: true }
    );
  }

  return memoryCustomerOverrides[customerId];
}

