import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from './entities/user.entity';

@ApiTags('사용자')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '프로필 조회', description: '현재 로그인한 사용자의 프로필을 조회합니다.' })
  @ApiResponse({ status: 200, description: '프로필을 성공적으로 조회했습니다.' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청입니다.' })
  getProfile(@GetUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '지갑 주소 수정', description: '현재 로그인한 사용자의 지갑 주소를 수정합니다.' })
  @ApiResponse({ status: 200, description: '지갑 주소가 성공적으로 수정되었습니다.' })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청입니다.' })
  updateProfile(
    @GetUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }
} 