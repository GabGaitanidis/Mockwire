import bcrypt from "bcrypt";
import { generateApiKey } from "../../data_generation/apiKeyGenerator";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

import {
  createUser,
  findUserByEmail,
  findUserById,
  findPublicUserById,
  updateRefreshToken,
} from "./auth.repo";

import { sha256 } from "./auth.helpers";
import { AppError } from "../../errors/AppError";

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const existingUser = await findUserByEmail(input.email);
  if (existingUser) {
    throw new AppError("Email already in use", 409);
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const apiKey = generateApiKey();

  const user = await createUser({
    name: input.name,
    email: input.email,
    password: hashedPassword,
    api_key: apiKey,
  });

  const accessToken = signAccessToken({
    sub: String(user.id),
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    sub: String(user.id),
  });

  await updateRefreshToken(user.id, sha256(refreshToken));

  return {
    user,
    accessToken,
    refreshToken,
  };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password);
  if (!passwordMatches) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = signAccessToken({
    sub: String(user.id),
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    sub: String(user.id),
  });

  await updateRefreshToken(user.id, sha256(refreshToken));

  return {
    user,
    accessToken,
    refreshToken,
  };
}

export async function refreshSession(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);

  const user = await findUserById(Number(payload.sub));
  if (!user || !user.refresh_token) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (sha256(refreshToken) !== user.refresh_token) {
    throw new AppError("Refresh token mismatch", 401);
  }

  const newAccessToken = signAccessToken({
    sub: String(user.id),
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const newRefreshToken = signRefreshToken({
    sub: String(user.id),
  });

  await updateRefreshToken(user.id, sha256(newRefreshToken));

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logoutUser(refreshToken?: string) {
  if (!refreshToken) return;

  try {
    const payload = verifyRefreshToken(refreshToken);
    await updateRefreshToken(Number(payload.sub), null);
  } catch {}
}

export async function getMeUser(userId: number) {
  const user = await findPublicUserById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}
