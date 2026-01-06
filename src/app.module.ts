import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import llmConfig from './config/llm.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketService } from './ticket/ticket.service';
import { TicketModule } from './ticket/ticket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [llmConfig] }),
    TicketModule,
  ],
  controllers: [AppController],
  providers: [AppService, TicketService],
})
export class AppModule {}
