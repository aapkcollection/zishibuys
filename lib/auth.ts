import { SignJWT, jwtVerify } from "jose";

const secretValue = process.env.AUTH_SECRET;

if (!secretValue && process.env.NODE_ENV === "production") {
  throw new Error("AUTH_SECRET is required in production");
}

const secret = new TextEncoder().encode(
  secretValue || "development-only-change-this-secret"
);

export async function createSession(adminId: string) {
  return new SignJWT({
    adminId,
    type: "admin",
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);

    if (
      payload.type !== "admin" ||
      typeof payload.adminId !== "string"
    ) {
      return null;
    }

    return payload.adminId;
  } catch {
    return null;
  }
}
