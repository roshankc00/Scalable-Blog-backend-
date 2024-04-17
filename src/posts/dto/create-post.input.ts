import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field()
  userId: number;

  @Field()
  content: string;

  @Field()
  imageUrl: string;

  @Field()
  tag: string;
}
