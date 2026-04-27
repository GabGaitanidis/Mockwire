import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().trim().min(6),
});

const updateUserSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    email: z.string().trim().email().optional(),
    password: z.string().trim().min(6).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export function validateCreateUser(data: unknown) {
  return createUserSchema.parse(data);
}

export function validateUpdateUser(data: unknown) {
  return updateUserSchema.parse(data);
}
