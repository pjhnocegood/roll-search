import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { TagType } from '../entities/tag.entity';
import { Category } from '../enums/category.enum';

export class FindAllWikiDto {
  @ApiProperty({ 
    required: false, 
    description: '카테고리로 필터링',
    enum: Category,
    example: Category.APPLICATIONS
  })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @ApiProperty({ 
    required: false, 
    description: '태그로 필터링', 
    enum: TagType,
    example: TagType.LAYER_2
  })
  @IsOptional()
  @IsEnum(TagType)
  tag?: TagType;
} 