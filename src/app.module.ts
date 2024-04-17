import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    UsersModule,
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('MYSQL_HOST'),
        port: configService.getOrThrow('MYSQL_HOST'),
        database: configService.getOrThrow('MYSQL_DATABASE'),
        username: configService.getOrThrow('MYSQL_USER'),
        password: configService.getOrThrow('MYSQL_ROOT_PASSWORD'),
        synchronize: configService.getOrThrow<boolean>('SYNCHRONIZE'),
        entities: ['dist/**/*.entity{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MYSQL_USER: Joi.string().required(),
        MYSQL_DATABASE: Joi.string().required(),
        MYSQL_ROOT_PASSWORD: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_HOST: Joi.string().required(),
        SYNCHRONIZE: Joi.bool().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      formatError: (error: any) => {
        const graphQLFormattedError = {
          message:
            error.extensions?.exception?.response?.message || error.message,
          code: error.extensions?.code || 'Internal server error',
          name: error.extensions?.exception?.name || error.name,
        };
        return graphQLFormattedError;
      },
    }),
    PostsModule,
    CommentsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
