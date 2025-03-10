import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Unique, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Wiki } from './wiki.entity';

@Entity()
@Unique(['user', 'wiki'])
export class Like {
  @ApiProperty({ description: '좋아요의 고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '사용자', type: () => User })
  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ApiProperty({ description: '위키 페이지', type: () => Wiki })
  @ManyToOne(() => Wiki, wiki => wiki.likes, { nullable: false, onDelete: 'CASCADE' })
  wiki: Wiki;

  @ApiProperty({ description: '생성 일시' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '좋아요 상태' })
  @Column()
  isLiked: boolean;
} 