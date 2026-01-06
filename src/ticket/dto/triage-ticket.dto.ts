import { IsNotEmpty } from 'class-validator';

export class TriageTicketDto {
  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  body: string;
}
