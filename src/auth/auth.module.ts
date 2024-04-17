import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: configService.get('ACCESS_TOKEN_EXP') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    LocalStrategy,
    JwtService,
  ],
})
export class AuthModule {}
