import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  create(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET') || '',
      }),
      user,
    };
  }

  findAll() {
    return `This action returns all auth`;
  }
  async validate(email: string, password: string) {
    const user = await this.usersService.findOneWithEmail(email);
    if (!user) {
      throw new BadRequestException('user with this email doesnt exist');
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new BadRequestException('user with this email doesnt exist');
    }
    return user;
  }
}
