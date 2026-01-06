import { Controller, Post, Body } from '@nestjs/common';
import { UsePipes, ValidationPipe } from '@nestjs/common';

import { TriageTicketDto } from './dto/triage-ticket.dto';
import { TriageResponseDto } from './dto/triage-response.dto';
import { TicketService } from './ticket.service';

@Controller('')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('triage-ticket')
  @UsePipes(new ValidationPipe())
  async triageTicket(
    @Body() triageTicketDto: TriageTicketDto,
  ): Promise<TriageResponseDto> {
    return await this.ticketService.triageTicket(
      triageTicketDto.subject,
      triageTicketDto.body,
    );
  }
}
