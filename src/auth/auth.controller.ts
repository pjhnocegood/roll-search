import { Controller, Get, UseGuards, Req, Res, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('github/login')
  @ApiOperation({ summary: 'GitHub 로그인 URL 반환' })
  @ApiResponse({ status: 200, description: 'GitHub 로그인 URL' })
  getGithubLoginUrl() {
    const clientId = this.configService.get('GITHUB_CLIENT_ID');
    const redirectUri = this.configService.get('GITHUB_CALLBACK_URL');
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
    return { url: githubAuthUrl };
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub 로그인 시작' })
  async githubAuth() {
    // GitHub 인증 페이지로 리다이렉트
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub 로그인 콜백' })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  async githubAuthCallback(@Req() req) {
    const { access_token } = await this.authService.login(req.user);

    console.log('access_token:', access_token);
    // 프론트엔드 URL로 리다이렉트 (토큰과 함께)
    return { access_token};
  }
} 