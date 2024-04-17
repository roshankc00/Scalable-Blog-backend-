import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field()
  content: string;

  @Field()
  imageUrl: string;

  @Field()
  tag: string;
}
