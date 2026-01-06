import {
  IsNotEmpty,
  IsBoolean,
  IsObject,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class Flags {
  @IsBoolean()
  requires_human: boolean;

  @IsBoolean()
  is_abusive: boolean;

  @IsBoolean()
  missing_info: boolean;

  @IsBoolean()
  is_vip_customer: boolean;
}

export class Usage {
  @IsNumber()
  inputTokens: number;

  @IsNumber()
  outputTokens: number;

  @IsNumber()
  costUSD: number;
}

export class TriageResponseDto {
  @IsNotEmpty()
  category: 'billing' | 'technical' | 'account' | 'sales';

  @IsNotEmpty()
  priority: 'low' | 'normal' | 'medium' | 'high' | 'urgent';

  @IsObject()
  @ValidateNested()
  @Type(() => Flags)
  flags: Flags;

  @IsObject()
  @ValidateNested()
  @Type(() => Usage)
  usage: Usage;
}
