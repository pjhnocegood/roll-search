import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: '지갑 주소',
    example: '0x1234...5678',
    required: false,
  })
  @IsOptional()
  @IsString()
  walletAddress?: string;
} 