import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly usersService: UsersService,
  ) {}
  async create(createPostInput: CreatePostInput) {
    const user = await this.usersService.findOne(createPostInput.userId);
    const post = this.postRepository.create({
      ...createPostInput,
      user,
    });
    return this.postRepository.save(post);
  }

  findAll() {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'commentUser')
      .getMany();
  }

  findOne(id: number) {
    return this.postRepository
      .createQueryBuilder('post')
      .where('post.id = :id', { id })
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'commentUser')
      .getOne();
  }

  async update(id: number, updatePostInput: UpdatePostInput) {
    const data = await this.postRepository.findOne({ where: { id } });
    if (!data) {
      throw new NotFoundException('post with this id doesnt exists');
    }
    const updData = Object.assign(data, updatePostInput);
    return this.postRepository.save(updData);
  }

  async remove(id: number) {
    const data = await this.postRepository.findOne({ where: { id } });
    if (!data) {
      throw new NotFoundException('post with this id doesnt exists');
    }
    return this.postRepository.remove(data);
  }
}
