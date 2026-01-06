import { registerAs } from '@nestjs/config';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function getAgentInstructions() {
  const instructionsPath = process.env.AGENT_INSTRUCTIONS_PATH;
  if (instructionsPath) {
    try {
      return readFileSync(resolve(process.cwd(), instructionsPath), 'utf8');
    } catch {
      return 'You are a helpful assistant.';
    }
  }
  return process.env.AGENT_INSTRUCTIONS || 'You are a helpful assistant.';
}

export default registerAs('llm', () => ({
  provider: process.env.LLM_PROVIDER || 'openai',
  openai: {
    agentName: process.env.AGENT_NAME || 'DefaultAgent',
    instructions: getAgentInstructions(),
    tokenCostPer1M: parseFloat(process.env.OPENAI_TOKEN_COST_PER_1M || '1.750'),
  },
}));
