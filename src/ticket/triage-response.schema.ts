import { z } from 'zod';

export const FlagsSchema = z.object({
  requires_human: z.boolean(),
  is_abusive: z.boolean(),
  missing_info: z.boolean(),
  is_vip_customer: z.boolean(),
});

export const UsageSchema = z.object({
  input_tokens: z.number(),
  output_tokens: z.number(),
  cost_usd: z.number(),
});

export const TriageResponseSchema = z.object({
  category: z.enum(['billing', 'technical', 'account', 'sales']),
  priority: z.enum(['low', 'normal', 'medium', 'high', 'urgent']),
  flags: FlagsSchema,
  usage: UsageSchema.optional(),
});
