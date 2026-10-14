import { SAMPLE_PRODUCTS } from "./sample-data";
import { CATEGORIES as INITIAL_CATEGORIES } from "./constants";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "nivora";

let client = null;
let clientPromise = null;
let MongoClient = null;
let ObjectId = null;

async function getMongoClasses() {
  if (!MongoClient && uri) {
    try {
      const pkg = "mongo" + "db";
      const mongodb = await import(/* webpackIgnore: true */ pkg);
      MongoClient = mongodb.MongoClient;
      ObjectId = mongodb.ObjectId;
    } catch (e) {
      console.warn("Could not import mongodb module:", e.message);
      return null;
    }
  }
  return { MongoClient, ObjectId };
}

// Global fallback in-memory store if MongoDB is not connected
let memoryProducts = JSON.parse(JSON.stringify(SAMPLE_PRODUCTS));
let memoryCategories = INITIAL_CATEGORIES.map((c, i) => ({
  _id: `cat-${i + 1}`,
  ...c,
  createdAt: new Date().toISOString(),
}));
let memoryOrders = [];
let memoryAdmins = [
  {
    _id: "admin-1",
    email: process.env.ADMIN_EMAIL || "admin@nivora.com",
    name: "Nivora Admin",
    role: "superadmin",
  },
];

export async function getDb() {
  if (!uri) {
    return null;
  }
  try {
    const mongoClasses = await getMongoClasses();
    if (!mongoClasses || !mongoClasses.MongoClient) return null;

    if (!clientPromise) {
      if (process.env.NODE_ENV === "development") {
        if (!global._mongoClientPromise) {
          client = new mongoClasses.MongoClient(uri);
          global._mongoClientPromise = client.connect();
        }
        clientPromise = global._mongoClientPromise;
      } else {
        client = new mongoClasses.MongoClient(uri);
        clientPromise = client.connect();
      }
    }

    const connectedClient = await clientPromise;
    return connectedClient.db(dbName);
  } catch (err) {
    console.warn("MongoDB connection warning, using memory storage:", err.message);
    return null;
  }
}

// Ensure database has initial sample products and categories seeded
export async function ensureDbSeeded() {
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
      query.category = { $regex: new RegExp(`^${filter.category}$`, "i") };
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
    list = list.filter((p) => p.category.toLowerCase() === filter.category.toLowerCase());
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
      const mongoClasses = await getMongoClasses();
      const query = mongoClasses?.ObjectId && mongoClasses.ObjectId.isValid(id)
        ? { _id: new mongoClasses.ObjectId(id) }
        : { _id: id };
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
    const mongoClasses = await getMongoClasses();
    const query = mongoClasses?.ObjectId && mongoClasses.ObjectId.isValid(id)
      ? { _id: new mongoClasses.ObjectId(id) }
      : { _id: id };
    const { _id, ...safeUpdates } = updateData;
    await db.collection("products").updateOne(query, { $set: safeUpdates });
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
    const mongoClasses = await getMongoClasses();
    const query = mongoClasses?.ObjectId && mongoClasses.ObjectId.isValid(id)
      ? { _id: new mongoClasses.ObjectId(id) }
      : { _id: id };
    const res = await db.collection("products").deleteOne(query);
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
    const mongoClasses = await getMongoClasses();
    const objectIds = [];
    const stringIds = [];
    ids.forEach((id) => {
      if (mongoClasses?.ObjectId && mongoClasses.ObjectId.isValid(id)) {
        try {
          objectIds.push(new mongoClasses.ObjectId(id));
        } catch {
          stringIds.push(id);
        }
      } else {
        stringIds.push(id);
      }
    });

    const conditions = [];
    if (objectIds.length > 0) conditions.push({ _id: { $in: objectIds } });
    if (stringIds.length > 0) conditions.push({ _id: { $in: stringIds } });

    if (conditions.length === 0) return 0;
    const query = conditions.length === 1 ? conditions[0] : { $or: conditions };
    const res = await db.collection("products").deleteMany(query);
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
    const mongoClasses = await getMongoClasses();
    const objectIds = [];
    const stringIds = [];
    ids.forEach((id) => {
      if (mongoClasses?.ObjectId && mongoClasses.ObjectId.isValid(id)) {
        try {
          objectIds.push(new mongoClasses.ObjectId(id));
        } catch {
          stringIds.push(id);
        }
      } else {
        stringIds.push(id);
      }
    });

    const conditions = [];
    if (objectIds.length > 0) conditions.push({ _id: { $in: objectIds } });
    if (stringIds.length > 0) conditions.push({ _id: { $in: stringIds } });

    if (conditions.length === 0) return 0;
    const query = conditions.length === 1 ? conditions[0] : { $or: conditions };
    const res = await db.collection("products").updateMany(query, { $set: updates });
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
  return code; // exactly 8 characters
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
      const mongoClasses = await getMongoClasses();
      const isObjId = mongoClasses?.ObjectId && mongoClasses.ObjectId.isValid(trimmed);

      const query = {
        $or: [
          { orderId: upper },
          { orderId: trimmed },
          { _id: upper },
          { _id: trimmed },
          ...(isObjId ? [{ _id: new mongoClasses.ObjectId(trimmed) }] : []),
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
      const mongoClasses = await getMongoClasses();
      const isObjId = mongoClasses?.ObjectId && mongoClasses.ObjectId.isValid(trimmed);
      const query = {
        $or: [
          { orderId: upper },
          { orderId: trimmed },
          { _id: upper },
          { _id: trimmed },
          ...(isObjId ? [{ _id: new mongoClasses.ObjectId(trimmed) }] : []),
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
      const mongoClasses = await getMongoClasses();
      const query = mongoClasses?.ObjectId && mongoClasses.ObjectId.isValid(id)
        ? { _id: new mongoClasses.ObjectId(id) }
        : { _id: id };
      const doc = await db.collection("categories").findOne(query);
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
    const mongoClasses = await getMongoClasses();
    const query = mongoClasses?.ObjectId && mongoClasses.ObjectId.isValid(id)
      ? { _id: new mongoClasses.ObjectId(id) }
      : { _id: id };
    await db.collection("categories").updateOne(query, { $set: safeUpdates });
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
    const mongoClasses = await getMongoClasses();
    const query = mongoClasses?.ObjectId && mongoClasses.ObjectId.isValid(id)
      ? { _id: new mongoClasses.ObjectId(id) }
      : { _id: id };
    const res = await db.collection("categories").deleteOne(query);
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
    const count = products.filter(
      (p) => p.category && p.category.toLowerCase() === cat.name.toLowerCase()
    ).length;
    return { ...cat, productCount: count };
  });
}

