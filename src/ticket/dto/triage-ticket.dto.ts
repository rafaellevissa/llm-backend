import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TriageTicketDto {
  @ApiProperty({ description: 'Ticket subject' })
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: 'Ticket body' })
  @IsNotEmpty()
  body: string;
}
