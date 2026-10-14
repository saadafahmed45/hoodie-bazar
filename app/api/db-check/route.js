import { NextResponse } from "next/server";
import { getDb, getLastDbError } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "hoodiee_bazar_db132";

  const diagnostics = {
    timestamp: new Date().toISOString(),
    hasMongoUri: Boolean(uri),
    targetDatabase: dbName,
    connectionStatus: "unknown",
    dbErrors: null,
    productsCount: 0,
    categoriesCount: 0,
    categories: [],
    sampleProducts: [],
    instructions: null,
    error: null,
  };

  if (!uri) {
    diagnostics.connectionStatus = "missing_environment_variable";
    diagnostics.error = "MONGODB_URI is not set in Vercel environment variables.";
    diagnostics.instructions = "Go to Vercel Dashboard -> Project -> Settings -> Environment Variables, and add MONGODB_URI and MONGODB_DB.";
    return NextResponse.json(diagnostics, { status: 200 });
  }

  try {
    const db = await getDb();
    const lastErrors = getLastDbError();
    diagnostics.dbErrors = lastErrors;

    if (!db) {
      diagnostics.connectionStatus = "connection_failed";
      diagnostics.error = lastErrors.lastConnectionError
        ? `MongoDB connection failed: ${lastErrors.lastConnectionError}. Likely cause: MongoDB Atlas Network Access is blocking Vercel. Add 0.0.0.0/0 to Atlas Network Access.`
        : lastErrors.lastMongoError
        ? `MongoDB driver load failed: ${lastErrors.lastMongoError}`
        : "getDb() returned null. Please verify Atlas Network Access allows 0.0.0.0/0.";
      return NextResponse.json(diagnostics, { status: 200 });
    }

    const [prodCount, catList, sampleProds] = await Promise.all([
      db.collection("products").countDocuments(),
      db.collection("categories").find({}).project({ name: 1, slug: 1 }).toArray(),
      db.collection("products").find({}).limit(3).project({ name: 1, category: 1, price: 1 }).toArray(),
    ]);

    diagnostics.connectionStatus = "connected";
    diagnostics.productsCount = prodCount;
    diagnostics.categoriesCount = catList.length;
    diagnostics.categories = catList.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      slug: c.slug,
    }));
    diagnostics.sampleProducts = sampleProds.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      category: p.category,
      price: p.price,
    }));

    return NextResponse.json(diagnostics, { status: 200 });
  } catch (err) {
    diagnostics.connectionStatus = "exception";
    diagnostics.error = err.message || String(err);
    return NextResponse.json(diagnostics, { status: 500 });
  }
}
