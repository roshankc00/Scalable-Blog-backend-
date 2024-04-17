import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';
import { Roles } from './constants/enums/role.enum';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let userService: UsersService;
  let userRepositoryMock: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    userService = module.get<UsersService>(UsersService);
    userRepositoryMock = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUser', () => {
    it('should have the createUser function', () => {
      expect(resolver.createUser).toBeDefined();
    });

    it('should create a new user', async () => {
      const userInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'test',
      };

      const userExists = null; // No user with the same email

      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(userExists);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      // Spy on the create method of the UserService
      const createServiceSpy = jest
        .spyOn(userService, 'create')
        .mockResolvedValue({ ...userInput, id: 1, role: 'USER' });

      await resolver.createUser(userInput);

      expect(createServiceSpy).toHaveBeenCalledWith(userInput);
    });

    it('should throw BadRequestException if user with email already exists', async () => {
      const userInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'test',
      };

      const userExists = new User();
      userExists.email = 'test@example.com';

      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(userExists);

      await expect(resolver.createUser(userInput)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOneUser', () => {
    it('should have the findOne functuon', () => {
      expect(resolver.findOne).toBeDefined();
    });
    it('should find a user by id', async () => {
      const userId = 1;
      const user = new User();
      user.id = userId;
      user.email = 'test@example.com';
      user.password = 'testpassword';
      user.role = Roles.USER;

      // Mock the findOne method of the UserService
      const findOneServiceSpy = jest
        .spyOn(userService, 'findOne')
        .mockResolvedValue(user);

      const result = await resolver.findOne(userId);

      expect(findOneServiceSpy).toHaveBeenCalledWith(userId);
      expect(result).toBe(user);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateUserInput = {
        id: 1,
        email: 'test@example.com',
        password: 'password123',
        name: 'test',
      };

      const userExists = new User();
      userExists.id = userId;
      userExists.email = 'test@example.com';

      // Mock the findOne method to return the existing user
      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(userExists);

      // Mock the update method of the UserService
      const updateServiceSpy = jest
        .spyOn(userService, 'update')
        .mockResolvedValue(userExists);

      const result = await resolver.updateUser(updateUserInput);

      expect(updateServiceSpy).toHaveBeenCalledWith(
        updateUserInput.id,
        updateUserInput,
      );
      expect(result).toBe(userExists);
    });
  });

  describe('getAllUser', () => {
    it('should find all users', async () => {
      const users = [
        {
          id: 1,
          email: 'test1@example.com',
          role: Roles.USER,
          password: 'hahaha',
          name: 'hahhhahahah',
        },
        {
          id: 2,
          email: 'test2@example.com',
          role: Roles.USER,
          password: 'hahaha',
          name: 'hahhhahahah',
        },
      ];

      const findAllServiceSpy = jest
        .spyOn(userService, 'findAll')
        .mockResolvedValue(users);

      const result = await resolver.findAll();

      expect(findAllServiceSpy).toHaveBeenCalled();
      expect(result).toBe(users);
    });
  });

  describe('removeUser', () => {
    it('should remove a user', async () => {
      const userId = 1;
      const userExists = new User();
      userExists.id = userId;
      userExists.email = 'test@example.com';

      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(userExists);

      const removeServiceSpy = jest
        .spyOn(userService, 'remove')
        .mockResolvedValue(userExists);

      const result = await resolver.removeUser(userId);

      expect(removeServiceSpy).toHaveBeenCalledWith(userId);
      expect(result).toBe(userExists);
    });
  });
});
