import { SAMPLE_PRODUCTS } from "./sample-data";

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

// Ensure database has initial sample products seeded
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

// Order helpers
export async function createOrder(orderData) {
  const db = await getDb();
  const newOrder = {
    ...orderData,
    createdAt: new Date(),
  };

  if (db) {
    const result = await db.collection("orders").insertOne(newOrder);
    return { ...newOrder, _id: result.insertedId.toString() };
  }

  const generatedId = "NV-" + Math.floor(100000 + Math.random() * 900000);
  const created = { ...newOrder, _id: generatedId };
  memoryOrders.unshift(created);
  return created;
}

export async function getOrders() {
  const db = await getDb();
  if (db) {
    const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray();
    return orders.map((o) => ({ ...o, _id: o._id.toString() }));
  }
  return [...memoryOrders];
}

export async function getOrderById(id) {
  const db = await getDb();
  if (db) {
    try {
      const mongoClasses = await getMongoClasses();
      const query = mongoClasses?.ObjectId && mongoClasses.ObjectId.isValid(id)
        ? { _id: new mongoClasses.ObjectId(id) }
        : { _id: id };
      const doc = await db.collection("orders").findOne(query);
      if (!doc) return null;
      return { ...doc, _id: doc._id.toString() };
    } catch {
      return null;
    }
  }
  return memoryOrders.find((o) => o._id === id) || null;
}

export async function updateOrderStatus(id, status) {
  const db = await getDb();
  if (db) {
    const mongoClasses = await getMongoClasses();
    const query = mongoClasses?.ObjectId && mongoClasses.ObjectId.isValid(id)
      ? { _id: new mongoClasses.ObjectId(id) }
      : { _id: id };
    await db.collection("orders").updateOne(query, { $set: { status, updatedAt: new Date() } });
    return getOrderById(id);
  }

  const index = memoryOrders.findIndex((o) => o._id === id);
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

