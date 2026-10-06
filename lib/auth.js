import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "nivora-winter-refined-secure-key-2026"
);

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@nivora.com";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin1234";

export async function verifyAdminCredentials(email, password) {
  if (!email || !password) return null;

  // Primary check against configured environment variable or default
  if (email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase()) {
    // Check against direct password or bcrypt hash
    if (password === DEFAULT_ADMIN_PASSWORD) {
      return {
        id: "admin-root",
        email: DEFAULT_ADMIN_EMAIL,
        name: "Nivora Administrator",
        role: "admin",
      };
    }
  }

  return null;
}

export async function createAdminToken(adminUser) {
  return await new SignJWT({
    id: adminUser.id,
    email: adminUser.email,
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
