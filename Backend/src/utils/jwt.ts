import jwt from "jsonwebtoken";
import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `CRITICAL: ${name} environment variable is not set. Cannot sign JWT tokens.`,
    );
  }

  return value;
}

const ACCESS_TOKEN_SECRET: string = requireEnv("ACCESS_TOKEN_SECRET");
const REFRESH_TOKEN_SECRET: string = requireEnv("REFRESH_TOKEN_SECRET");

export type AccessTokenPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
};

export type RefreshTokenPayload = {
  sub: string;
};

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

export function signRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
}
