import {
  IsNotEmpty,
  IsBoolean,
  IsObject,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class Flags {
  @ApiProperty({
    description: 'Indicates if the ticket requires human intervention',
  })
  @IsBoolean()
  requires_human: boolean;

  @ApiProperty({ description: 'Indicates if the ticket is abusive' })
  @IsBoolean()
  is_abusive: boolean;

  @ApiProperty({
    description: 'Indicates if the ticket has missing information',
  })
  @IsBoolean()
  missing_info: boolean;

  @ApiProperty({ description: 'Indicates if the customer is a VIP' })
  @IsBoolean()
  is_vip_customer: boolean;
}

export class Usage {
  @ApiProperty({ description: 'Number of input tokens used' })
  @IsNumber()
  inputTokens: number;

  @ApiProperty({ description: 'Number of output tokens generated' })
  @IsNumber()
  outputTokens: number;

  @ApiProperty({ description: 'Total cost in USD for processing the ticket' })
  @IsNumber()
  costUSD: number;
}

export class TriageResponseDto {
  @ApiProperty({
    description: 'Category assigned to the ticket',
    enum: ['billing', 'technical', 'account', 'sales'],
  })
  @IsNotEmpty()
  category: 'billing' | 'technical' | 'account' | 'sales';

  @ApiProperty({
    description: 'Priority level assigned to the ticket',
    enum: ['low', 'normal', 'medium', 'high', 'urgent'],
  })
  @IsNotEmpty()
  priority: 'low' | 'normal' | 'medium' | 'high' | 'urgent';

  @ApiProperty({
    description: 'Flags providing additional information about the ticket',
  })
  @IsObject()
  @ValidateNested()
  @Type(() => Flags)
  flags: Flags;

  @ApiProperty({ description: 'Usage statistics for processing the ticket' })
  @IsObject()
  @ValidateNested()
  @Type(() => Usage)
  usage: Usage;
}
