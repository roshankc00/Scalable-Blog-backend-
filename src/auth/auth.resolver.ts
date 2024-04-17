import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateAuthInput } from './dto/create-auth.input';
import { User } from 'src/users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gqlauthguard';
import { LoginResponse } from './types/login.response';
import { CurrentUser } from './decorators/currentUser';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  loginUser(
    @Args('createAuthInput') createAuthInput: CreateAuthInput,
    @CurrentUser() user: User,
  ) {
    console.log(user);
    return this.authService.create(user);
  }
}
