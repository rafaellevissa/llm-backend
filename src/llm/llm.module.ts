import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OpenAiProvider } from './openai.provider';

const providers = [OpenAiProvider];

@Module({
  imports: [ConfigModule],
  providers: [...providers],
  exports: [...providers],
})
export class LlmModule {
  static forRoot(): DynamicModule {
    return {
      module: LlmModule,
      imports: [ConfigModule],
      providers: [...providers],
      exports: [...providers],
    };
  }
}
