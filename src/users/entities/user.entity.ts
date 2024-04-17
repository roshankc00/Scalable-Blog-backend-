import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '../constants/enums/role.enum';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({
    unique: true,
    name: 'email',
  })
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Field()
  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.USER,
  })
  role: string;
}
