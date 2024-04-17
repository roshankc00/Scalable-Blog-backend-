import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  email: string;
  
  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}
