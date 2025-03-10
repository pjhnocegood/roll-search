import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wiki } from './entities/wiki.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { WikiService } from './wiki.service';
import { WikiController } from './wiki.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wiki, Comment, Like]),
    UsersModule,
  ],
  providers: [WikiService],
  controllers: [WikiController],
})
export class WikiModule {} 