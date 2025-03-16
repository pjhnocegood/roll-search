import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Like } from './like.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ nullable: true })
  walletAddress: string;

  @OneToMany(() => Like, like => like.user)
  likes: Like[];
} 