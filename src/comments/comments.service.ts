import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { UsersService } from 'src/users/users.service';
import { PostsService } from 'src/posts/posts.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly postService: PostsService,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  async create(createCommentInput: CreateCommentInput) {
    const user = await this.usersService.findOne(createCommentInput.userId);
    const post = await this.postService.findOne(createCommentInput.postId);
    const comment = this.commentRepository.create({
      content: createCommentInput.content,
      user,
      post,
    });
    return this.commentRepository.save(comment);
  }

  findAll() {
    return this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.post', 'post')
      .leftJoinAndSelect('comment.user', 'user')
      .getMany();
  }

  findOne(id: number) {
    return this.commentRepository
      .createQueryBuilder('comment')
      .where('post.id = :id', { id })
      .leftJoinAndSelect('comment.post', 'post')
      .leftJoinAndSelect('comment.user', 'user');
  }

  async update(id: number, updateCommentInput: UpdateCommentInput) {
    const comment = await this.commentRepository.find({ where: { id } });
    const updCmt = Object.assign(comment, updateCommentInput);
    if (!comment) {
      throw new BadRequestException('post with this id doesnt exists');
    }
    return this.commentRepository.save(updCmt);
  }

  async remove(id: number) {
    const comment = await this.commentRepository.find({ where: { id } });
    if (!comment) {
      throw new BadRequestException('post with this id doesnt exists');
    }
    return this.commentRepository.remove(comment);
  }
}
