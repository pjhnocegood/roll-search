import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userDetails: any): Promise<any> {
    const user = await this.usersService.findByGithubId(userDetails.githubId);
    
    if (!user) {
      return await this.usersService.create(userDetails);
    }
    
    return await this.usersService.update(user.id, userDetails);
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
} 