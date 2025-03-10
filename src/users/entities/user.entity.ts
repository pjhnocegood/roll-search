import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Wiki } from '../../wiki/entities/wiki.entity';
import { Comment } from '../../wiki/entities/comment.entity';
import { Like } from '../../wiki/entities/like.entity';

@Entity()
export class User {
  @ApiProperty({ description: '사용자의 고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'GitHub ID' })
  @Column({ unique: true })
  githubId: string;

  @ApiProperty({ description: '사용자 이름' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: '이메일 주소' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: '비밀번호', required: false })
  @Column({ nullable: true })
  password?: string;

  @ApiProperty({ description: '지갑 주소', required: false })
  @Column({ nullable: true })
  walletAddress?: string;

  @ApiProperty({ description: '프로필 이미지 URL', required: false })
  @Column({ nullable: true })
  avatarUrl?: string;

  @ApiProperty({ description: '생성한 위키 페이지 목록' })
  @OneToMany(() => Wiki, wiki => wiki.author)
  wikis: Wiki[];

  @ApiProperty({ description: '생성한 댓글 목록' })
  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

  @ApiProperty({ description: '생성한 좋아요 목록' })
  @OneToMany(() => Like, like => like.user)
  likes: Like[];

  @ApiProperty({ description: '생성 일시' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '수정 일시' })
  @UpdateDateColumn()
  updatedAt: Date;
} 