import { Injectable, Inject } from '@nestjs/common';

import { TriageResponseDto } from './dto/triage-response.dto';
import { TriageResponseSchema } from './triage-response.schema';
import type { LlmProvider } from '../llm/llm.provider';
import { OpenAiProvider } from '../llm/openai.provider';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TicketService {
  constructor(
    @Inject(OpenAiProvider) private readonly llmProvider: LlmProvider,
    private readonly configService: ConfigService,
  ) {}

  async triageTicket(
    subject: string,
    body: string,
  ): Promise<TriageResponseDto> {
    const llmResult = await this.llmProvider.generateResponse(
      `Subject: ${subject}\nBody: ${body}`,
    );

    let parsed: unknown;
    try {
      parsed =
        typeof llmResult.finalOutput === 'string'
          ? JSON.parse(llmResult.finalOutput)
          : llmResult.finalOutput;
    } catch {
      throw new Error('Invalid JSON returned by LLM');
    }

    const result = TriageResponseSchema.safeParse(parsed);
    if (!result.success) {
      throw new Error(
        'LLM output validation failed: ' +
          JSON.stringify(result.error.format()),
      );
    }

    const usage = llmResult.state._lastTurnResponse.usage;

    const inputTokenCostPer1M =
      Number(this.configService.get('OPENAI_TOKEN_COST_PER_1M_INPUT')) || 0;
    const outputTokenCostPer1M =
      Number(this.configService.get('OPENAI_TOKEN_COST_PER_1M_OUTPUT')) || 0;
    const inputTokens = usage.inputTokens ?? 0;
    const outputTokens = usage.outputTokens ?? 0;
    const costUSD =
      (inputTokens / 1_000_000) * inputTokenCostPer1M +
      (outputTokens / 1_000_000) * outputTokenCostPer1M;

    return {
      ...result.data,
      usage: {
        inputTokens,
        outputTokens,
        costUSD,
      },
    };
  }
}
