import { Injectable } from '@nestjs/common';
import { Agent, run } from '@openai/agents';
import { ConfigService } from '@nestjs/config';

import { LlmProvider } from './llm.provider';
import { triageTool } from './triage-tool';

@Injectable()
export class OpenAiProvider implements LlmProvider {
  name = 'openai';

  constructor(private readonly configService: ConfigService) {}

  async generateResponse(prompt: string): Promise<any> {
    const name = this.configService.get<string>(
      'llm.openai.agentName',
    ) as string;
    const instructions = this.configService.get<string>(
      'llm.openai.instructions',
    );

    const agent = new Agent({
      name,
      instructions,
      tools: [triageTool],
      toolUseBehavior: 'stop_on_first_tool',
    });

    return await run(agent, prompt);
  }
}
