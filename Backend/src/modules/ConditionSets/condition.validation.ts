import { z } from "zod";

const conditionBranchSchema = z.object({
  if: z.record(z.string(), z.string()),
  then: z.record(z.string(), z.any()),
});

export const createConditionSetSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).optional(),
  conditions: z.array(conditionBranchSchema).min(1),
});

export function validateCreateConditionSet(data: unknown) {
  return createConditionSetSchema.parse(data);
}

export const updateConditionSetSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    conditions: z.array(conditionBranchSchema).min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export function validateUpdateConditionSet(data: unknown) {
  return updateConditionSetSchema.parse(data);
}

export type ConditionBranch = z.infer<typeof conditionBranchSchema>;
export type CreateConditionSetInput = z.infer<typeof createConditionSetSchema>;
export type UpdateConditionSetInput = z.infer<typeof updateConditionSetSchema>;
