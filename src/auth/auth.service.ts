import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoggerService } from '../logger/logger.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.model';

@Injectable()
export class AuthService {
  private readonly logger = new LoggerService(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    this.logger.setMethod(this.validateUser.name);
    const dbUser = await this.usersService.checkPassword(username, pass);
    if (dbUser) {
      const user = new User();
      user.username = dbUser.username;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return user;
    }
    return null;
  }

  async login(user: any) {
    this.logger.setMethod(this.login.name);
    const dbUser = await this.usersService.findUser(user.username);
    if (!dbUser) {
      return null;
    }
    const payload = { username: user.username, sub: user.userId };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
