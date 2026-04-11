import { z } from "zod";

const createRuleSchema = z.object({
  endpoint: z.string().min(1).regex(/^\//, "endpoint must start with '/'"),
  dataSchema: z.record(z.string(), z.any()).optional(),
  latency: z.number().int().min(0).max(30000).optional().default(0),
  errorRate: z.number().int().min(0).max(100).optional().default(0),
  statusCodes: z
    .record(
      z.string(),
      z.object({
        weight: z.number().min(0).max(100),
        message: z.string().min(1),
      }),
    )
    .optional()
    .default({ "200": { weight: 100, message: "OK" } })
    .refine(
      (data) => {
        const weights = Object.values(data).map((item) => item.weight);
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        return totalWeight === 100;
      },
      {
        message: "The sum of status code weights must equal 100%",
      },
    ),
});

export function validateCreateRule(data: any) {
  return createRuleSchema.parse(data);
}
