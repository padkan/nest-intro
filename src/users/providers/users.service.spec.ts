import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { CreateUserProvider } from './create-user.provider';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { DataSource, getRepository, Repository } from 'typeorm';
import { AuthService } from 'src/auth/providers/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm/dist/common/typeorm.utils';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { mock } from 'node:test';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const mockCreateUserProvider: Partial<CreateUserProvider> = {
      createUser: (createUserDto: CreateUserDto) =>
        Promise.resolve({
          id: 12,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName ?? '', // Ensure lastName is always a string
          email: createUserDto.email,
          password: createUserDto.password ?? null, // Ensure password is always a string
        } as User),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: CreateGoogleUserProvider,
          useValue: mockCreateUserProvider,
        },
        {
          provide: FindOneByGoogleIdProvider,
          useValue: { findOne: jest.fn() },
        },
        {
          provide: FindOneUserByEmailProvider,
          useValue: { findOne: jest.fn() },
        },
        {
          provide: CreateUserProvider,
          useValue: mockCreateUserProvider, // ✅ use this one, not the { create: jest.fn() }
        },
        {
          provide: UsersCreateManyProvider,
          useValue: { createMany: jest.fn() },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: { getRepository: jest.fn() },
        },
        {
          provide: AuthService,
          useValue: { validateUser: jest.fn() },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    it('should be defined', () => {
      expect(usersService.createUser.bind(usersService)).toBeDefined();
    });

    it('should call createUser on CreateUserProvider', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
      };
      const user = await usersService.createUser(createUserDto);
      expect(user.firstName).toEqual('John');
    });
  });
});
