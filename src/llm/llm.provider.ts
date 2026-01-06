export interface LlmProvider {
  name: string;
  generateResponse(prompt: string, options?: Record<string, any>): Promise<any>;
}
