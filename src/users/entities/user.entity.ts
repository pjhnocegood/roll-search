import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Wiki } from '../../wiki/entities/wiki.entity';

@Entity()
export class User {
  @ApiProperty({ description: '사용자의 고유 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'GitHub ID' })
  @Column({ unique: true })
  githubId: string;

  @ApiProperty({ description: '사용자 이름' })
  @Column()
  username: string;

  @ApiProperty({ description: '이메일 주소' })
  @Column({ nullable: true })
  email: string;

  @ApiProperty({ description: 'GitHub 프로필 이미지 URL' })
  @Column({ nullable: true })
  avatarUrl: string;

  @ApiProperty({ description: '생성한 위키 페이지 목록' })
  @OneToMany(() => Wiki, wiki => wiki.author)
  wikis: Wiki[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 