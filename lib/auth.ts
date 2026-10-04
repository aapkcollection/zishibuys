import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "CHANGE_THIS_SECRET_BEFORE_PRODUCTION"
);

export async function createSession(adminId: string) {
  return new SignJWT({ adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return typeof payload.adminId === "string" ? payload.adminId : null;
  } catch {
    return null;
  }
}
