import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserInput: CreateUserInput) {
    const userExists = await this.userRepository.findOne({
      where: {
        email: createUserInput.email,
      },
    });
    if (userExists) {
      throw new BadRequestException('User with this email already exists');
    }
    const hashedPassdword = await bcrypt.hash(createUserInput.password, 10);
    const newUser = this.userRepository.create({
      ...createUserInput,
      password: hashedPassdword,
    });
    return this.userRepository.save(newUser);
  }

  findAll() {
    return this.userRepository.find({});
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    const userExists = await this.userRepository.findOne({
      where: { id },
    });
    if (!userExists) {
      throw new BadRequestException('User with this email already exists');
    }
    const updUser = Object.assign(userExists, updateUserInput);
    return this.userRepository.save(updUser);
  }

  async remove(id: number) {
    const userExists = await this.userRepository.findOne({
      where: { id },
    });
    if (!userExists) {
      throw new BadRequestException('User with this email dont  exists');
    }
    return this.userRepository.remove(userExists);
  }
}
