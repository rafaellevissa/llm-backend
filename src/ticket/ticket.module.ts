import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LlmModule } from '../llm/llm.module';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  imports: [ConfigModule, LlmModule],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [LlmModule],
})
export class TicketModule {}
