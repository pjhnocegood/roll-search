import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { Category } from '../enums/category.enum';
import { TagType } from '../entities/tag.entity';

export class UpdateWikiDto {
  @ApiProperty({
    description: '위키 페이지의 제목',
    example: '자바스크립트 소개',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: '위키 페이지의 내용',
    example: '자바스크립트는 웹 브라우저에서 실행되는 프로그래밍 언어입니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: '위키 페이지의 카테고리',
    enum: Category,
    example: Category.APPLICATIONS,
    required: false,
  })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @ApiProperty({
    description: '위키 페이지의 태그 목록',
    type: [String],
    enum: TagType,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(TagType, { each: true })
  tags?: TagType[];
} 