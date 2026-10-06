import crypto from "crypto";

const KEY_LENGTH = 64;

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = await new Promise<string>((resolve, reject) => {
    crypto.scrypt(
      password,
      salt,
      KEY_LENGTH,
      {
        N: 16384,
        r: 8,
        p: 1,
      },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey.toString("hex"));
      }
    );
  });

  return `${salt}:${hash}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string
) {
  try {
    const [salt, originalHash] = storedHash.split(":");

    if (!salt || !originalHash) {
      return false;
    }

    const hash = await new Promise<string>((resolve, reject) => {
      crypto.scrypt(
        password,
        salt,
        KEY_LENGTH,
        {
          N: 16384,
          r: 8,
          p: 1,
        },
        (error, derivedKey) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(derivedKey.toString("hex"));
        }
      );
    });

    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(originalHash, "hex")
    );
  } catch {
    return false;
  }
}
