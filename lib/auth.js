import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getAdminUserByEmail, updateAdminUser } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "nivora-winter-refined-secure-key-2026"
);

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@nivora.com";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin1234";

export async function verifyAdminCredentials(email, password) {
  if (!email || !password) return null;
  const cleanEmail = email.toLowerCase().trim();

  try {
    // 1. Check database-backed admin users first
    const dbAdmin = await getAdminUserByEmail(cleanEmail);
    if (dbAdmin) {
      if (dbAdmin.status === "suspended") {
        throw new Error("This administrative account has been suspended.");
      }

      let passwordValid = false;
      if (dbAdmin.password === password) {
        passwordValid = true;
      } else {
        try {
          passwordValid = await bcrypt.compare(password, dbAdmin.password);
        } catch {
          passwordValid = false;
        }
      }

      if (passwordValid) {
        // Record last login in background
        updateAdminUser(dbAdmin._id, { lastLogin: new Date().toISOString() }).catch(() => {});
        return {
          id: dbAdmin._id,
          email: dbAdmin.email,
          name: dbAdmin.name,
          role: dbAdmin.role || "customer_manager",
        };
      }
    }
  } catch (err) {
    if (err.message.includes("suspended")) {
      throw err;
    }
    console.warn("DB admin check warning:", err.message);
  }

  // 2. Fallback check against configured environment variable or default
  if (cleanEmail === DEFAULT_ADMIN_EMAIL.toLowerCase()) {
    if (password === DEFAULT_ADMIN_PASSWORD) {
      return {
        id: "admin-root",
        email: DEFAULT_ADMIN_EMAIL,
        name: "Nivora Administrator",
        role: "super_admin",
      };
    }
  }

  return null;
}

export async function verifyAdminGoogleAccount(email, name, photoUrl) {
  if (!email) return null;
  const cleanEmail = email.toLowerCase().trim();

  try {
    // 1. Check database-backed admin users first
    const dbAdmin = await getAdminUserByEmail(cleanEmail);
    if (dbAdmin) {
      if (dbAdmin.status === "suspended") {
        throw new Error("This administrative account has been suspended.");
      }

      // Record last login in background
      updateAdminUser(dbAdmin._id, {
        lastLogin: new Date().toISOString(),
        ...(name && (!dbAdmin.name || dbAdmin.name === "Admin User") ? { name } : {}),
      }).catch(() => {});

      return {
        id: dbAdmin._id,
        email: dbAdmin.email,
        name: dbAdmin.name || name || "Administrator",
        role: dbAdmin.role || "customer_manager",
      };
    }
  } catch (err) {
    if (err.message.includes("suspended")) {
      throw err;
    }
    console.warn("DB admin Google check warning:", err.message);
  }

  // 2. Fallback check against configured environment variable or default
  if (cleanEmail === DEFAULT_ADMIN_EMAIL.toLowerCase()) {
    return {
      id: "admin-root",
      email: DEFAULT_ADMIN_EMAIL,
      name: name || "Nivora Administrator",
      role: "super_admin",
    };
  }

  return null;
}


export async function createAdminToken(adminUser) {
  return await new SignJWT({
    id: adminUser.id,
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token) {
  try {
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("nivora_admin_token")?.value;
  if (!token) return null;
  return await verifyAdminToken(token);
}
