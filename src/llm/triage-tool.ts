/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
import { z } from 'zod';
import { tool } from '@openai/agents';

export const triageTool = tool({
  name: 'triage_ticket',
  description: 'Return a triage result for a support ticket as a JSON object.',
  parameters: z.object({
    category: z.enum(['billing', 'technical', 'account', 'sales']),
    priority: z.enum(['low', 'normal', 'medium', 'high', 'urgent']),
    flags: z.object({
      requires_human: z.boolean(),
      is_abusive: z.boolean(),
      missing_info: z.boolean(),
      is_vip_customer: z.boolean(),
    }),
  }),
  execute: async (input) => {
    return input;
  },
});
