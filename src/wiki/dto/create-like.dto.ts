import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty({
    description: '좋아요 상태',
    example: true,
  })
  @IsBoolean()
  isLiked: boolean;
} 