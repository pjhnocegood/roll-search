import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';

@Entity()
export class Wiki {
  @ApiProperty({ description: '위키 페이지의 고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '위키 페이지의 제목' })
  @Column()
  title: string;

  @ApiProperty({ description: '위키 페이지의 내용' })
  @Column('text')
  content: string;

  @ApiProperty({ description: '위키 페이지의 카테고리', required: false })
  @Column({ nullable: true })
  category: string;

  @ApiProperty({ description: '조회수', default: 0 })
  @Column({ default: 0 })
  views: number;

  @ApiProperty({ description: '좋아요 수', default: 0 })
  @Column({ default: 0 })
  likesCount: number;

  @ApiProperty({ description: '작성자' })
  @ManyToOne(() => User, user => user.wikis, { nullable: false })
  author: User;

  @ApiProperty({ description: '댓글 목록' })
  @OneToMany('Comment', 'wiki')
  comments: Comment[];

  @ApiProperty({ description: '좋아요 목록' })
  @OneToMany('Like', 'wiki')
  likes: Like[];

  @ApiProperty({ description: '생성 일시' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '수정 일시' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: '마지막 수정자', required: false })
  @Column({ nullable: true })
  lastEditedBy: string;
} 