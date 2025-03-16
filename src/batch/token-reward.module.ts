import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenRewardService } from './token-reward.service';
import { User } from '../entities/user.entity';
import { Like } from '../entities/like.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([User, Like]),
  ],
  providers: [TokenRewardService],
})
export class TokenRewardModule {} 