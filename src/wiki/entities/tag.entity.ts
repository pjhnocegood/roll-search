import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Wiki } from './wiki.entity';

export enum TagType {
  LAYER_2 = 'LAYER_2',
  SCALING = 'SCALING',
  PRIVACY = 'PRIVACY',
  SECURITY = 'SECURITY',
  DEFI = 'DEFI',
  NFT = 'NFT',
  GAMING = 'GAMING',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  TOOLING = 'TOOLING',
  OTHER = 'OTHER',
}

@Entity()
export class Tag {
  @ApiProperty({ description: '태그의 고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '태그 이름', enum: TagType })
  @Column({
    type: 'enum',
    enum: TagType,
    unique: true,
  })
  name: TagType;

  @ApiProperty({ description: '태그가 적용된 위키 목록' })
  @ManyToMany(() => Wiki, (wiki) => wiki.tags)
  @JoinTable()
  wikis: Wiki[];
} 