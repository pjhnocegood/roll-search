import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateWikiDto {
  @ApiProperty({
    description: '위키 페이지의 제목',
    example: '자바스크립트 소개',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '위키 페이지의 내용',
    example: '자바스크립트는 웹 브라우저에서 실행되는 프로그래밍 언어입니다.',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: '위키 페이지의 카테고리',
    example: '프로그래밍',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;
} 