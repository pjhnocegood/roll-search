import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WikiModule } from './wiki/wiki.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TokenRewardModule } from './batch/token-reward.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // 프로덕션 환경에서는 false로 설정
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        migrationsRun: true, // 애플리케이션 시작 시 마이그레이션 자동 실행
      }),
      inject: [ConfigService],
    }),
    WikiModule,
    AuthModule,
    UsersModule,
    TokenRewardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
