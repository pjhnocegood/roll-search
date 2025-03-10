import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Category } from '../enums/category.enum';
import { Tag } from './tag.entity';

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

  @ApiProperty({ description: '위키 페이지의 카테고리', required: false, enum: Category })
  @Column({
    type: 'enum',
    enum: Category,
    default: Category.OTHER,
  })
  category: Category;

  @ApiProperty({ description: '위키 페이지의 태그 목록', type: () => [Tag] })
  @ManyToMany(() => Tag, tag => tag.wikis)
  @JoinTable({
    name: 'wiki_tags',
    joinColumn: {
      name: 'wiki_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];

  @ApiProperty({ description: '조회수', default: 0 })
  @Column({ default: 0 })
  views: number;

  @ApiProperty({ description: '좋아요 수', default: 0 })
  @Column({ default: 0 })
  likesCount: number;

  @ApiProperty({ description: '작성자', type: () => User })
  @ManyToOne(() => User, user => user.wikis, { nullable: false })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'author_id' })
  authorId: number;

  @ApiProperty({ description: '댓글 목록', type: () => [Comment] })
  @OneToMany(() => Comment, comment => comment.wiki)
  comments: Comment[];

  @ApiProperty({ description: '좋아요 목록', type: () => [Like] })
  @OneToMany(() => Like, like => like.wiki)
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