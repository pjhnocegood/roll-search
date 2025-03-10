import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: '댓글 내용',
    example: '매우 유익한 내용이네요!',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
} 