import z from "zod";

export const createUrlSchema = z.object({
  ruleId: z.preprocess((val) => Number(val), z.number().int().positive()),
});
