import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ethers } from "ethers";
import { User } from "../entities/user.entity";
import { Like } from "../entities/like.entity";

@Injectable()
export class TokenRewardService implements OnModuleInit {
  private readonly logger = new Logger(TokenRewardService.name);
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private tokenContract: ethers.Contract;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  onModuleInit() {
    if (!process.env.ETHEREUM_RPC_URL) {
      throw new Error('ETHEREUM_RPC_URL is not defined in environment variables');
    }
    if (!process.env.PRIVATE_KEY) {
      throw new Error('PRIVATE_KEY is not defined in environment variables');
    }
    if (!process.env.TOKEN_CONTRACT_ADDRESS) {
      throw new Error('TOKEN_CONTRACT_ADDRESS is not defined in environment variables');
    }

    this.provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    this.tokenContract = new ethers.Contract(
      process.env.TOKEN_CONTRACT_ADDRESS,
      [
        'function transfer(address to, uint256 amount) public returns (bool)',
        'function balanceOf(address account) public view returns (uint256)',
      ],
      this.wallet
    );
  }

  @Cron(CronExpression.EVERY_WEEK)
  async distributeTokenRewards() {
    try {
      this.logger.log('Starting weekly token distribution...');

      // 일주일 동안의 좋아요 수를 집계
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const topUser = await this.likeRepository
        .createQueryBuilder('like')
        .select('like.userId')
        .addSelect('COUNT(*)', 'likeCount')
        .where('like.createdAt >= :startDate', { startDate })
        .groupBy('like.userId')
        .orderBy('likeCount', 'DESC')
        .limit(1)
        .getRawOne();

      if (!topUser) {
        this.logger.log('No users found for token distribution');
        return;
      }

      const user = await this.userRepository.findOne({
        where: { id: topUser.userId },
      });

      if (!user?.walletAddress) {
        this.logger.log('Top user does not have a wallet address');
        return;
      }

      // 토큰 보상 전송 (예: 10 토큰)
      const amount = ethers.parseUnits('10', 18); // 18 decimals for most ERC20 tokens
      const tx = await this.tokenContract.transfer(user.walletAddress, amount);
      await tx.wait();

      this.logger.log(`Tokens sent to ${user.walletAddress}`);
    } catch (error) {
      this.logger.error('Error in token distribution:', error);
    }
  }
} 