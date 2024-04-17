import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Roles } from './constants/enums/role.enum';
import * as bcrypt from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userRepositoryMock: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepositoryMock = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create a new user', async () => {
      const createUserInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'roshan karki',
        posts: [],
      };

      const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
      const newUser = {
        id: 1,
        ...createUserInput,
        password: hashedPassword,
        role: Roles.USER,
      };

      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(userRepositoryMock, 'create').mockReturnValue(newUser);
      jest.spyOn(userRepositoryMock, 'save').mockResolvedValue(newUser);

      const result = await service.create(createUserInput);

      expect(result).toEqual(newUser);
    });

    it('should throw BadRequestException if user with email already exists', async () => {
      const createUserInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Roshan',
      };

      const existingUser = new User();
      existingUser.email = createUserInput.email;

      jest
        .spyOn(userRepositoryMock, 'findOne')
        .mockResolvedValueOnce(existingUser);

      await expect(service.create(createUserInput)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: 1,
          email: 'test@example.com',
          password: 'password',
          role: Roles.USER,
          name: 'Roshan karki',
          posts: [],
        },
        {
          id: 2,
          email: 'test@example.com',
          password: 'password',
          role: Roles.USER,
          name: 'Roshan karki',
          posts: [],
        },
      ];

      jest.spyOn(userRepositoryMock, 'find').mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const userId = 1;
      const user = {
        id: userId,
        email: 'test@example.com',
        password: 'password',
        role: Roles.USER,
        name: 'Roshan karki',
        posts: [],
      };

      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(user);

      const result = await service.findOne(userId);

      expect(result).toEqual(user);
    });

    it('should return null if user does not exist', async () => {
      const userId = 1;

      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(null);

      const result = await service.findOne(userId);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateUserInput = {
        id: userId,
        email: 'updated@example.com',
        password: 'newpassword',
        name: 'update  karki',
      };

      const existingUser = new User();
      existingUser.id = userId;
      existingUser.email = 'test@example.com';
      existingUser.password = 'password';

      const updatedUser = {
        ...existingUser,
        ...updateUserInput,
      };

      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(existingUser);
      jest.spyOn(userRepositoryMock, 'save').mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateUserInput);

      expect(result).toEqual(updatedUser);
    });

    it('should throw BadRequestException if user does not exist', async () => {
      const userId = 1;
      const updateUserInput = {
        email: 'updated@example.com',
        password: 'newpassword',
        id: userId,
        name: 'throw me ',
      };

      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(null);

      await expect(service.update(userId, updateUserInput)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = 1;

      const existingUser = new User();
      existingUser.id = userId;
      existingUser.email = 'test@example.com';
      existingUser.password = 'password';

      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(existingUser);
      jest.spyOn(userRepositoryMock, 'remove').mockResolvedValue(existingUser);

      const result = await service.remove(userId);

      expect(result).toEqual(existingUser);
    });

    it('should throw BadRequestException if user does not exist', async () => {
      const userId = 1;

      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(null);

      await expect(service.remove(userId)).rejects.toThrow(BadRequestException);
    });
  });
});
