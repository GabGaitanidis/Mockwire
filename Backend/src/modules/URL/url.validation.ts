import z from "zod";

export const createUrlSchema = z.object({
  ruleId: z.preprocess((val) => Number(val), z.number().int().positive()),
});

export const updateUrlParamsSchema = z.object({
  id: z.preprocess((val) => Number(val), z.number().int().positive()),
});

export const updateUrlBodySchema = z.object({
  url: z.string().url(),
});

export const deleteUrlParamsSchema = z.object({
  id: z.preprocess((val) => Number(val), z.number().int().positive()),
});
