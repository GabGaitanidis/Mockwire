import jwt from "jsonwebtoken";
import "dotenv/config";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

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
