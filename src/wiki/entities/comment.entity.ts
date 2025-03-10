import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Wiki } from './wiki.entity';

@Entity()
export class Comment {
  @ApiProperty({ description: '댓글의 고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '댓글 내용' })
  @Column('text')
  content: string;

  @ApiProperty({ description: '작성자', type: () => User })
  @ManyToOne(() => User, { nullable: false })
  author: User;

  @ApiProperty({ description: '위키 페이지', type: () => Wiki })
  @ManyToOne(() => Wiki, wiki => wiki.comments, { nullable: false, onDelete: 'CASCADE' })
  wiki: Wiki;

  @ApiProperty({ description: '생성 일시' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '수정 일시' })
  @UpdateDateColumn()
  updatedAt: Date;
} 