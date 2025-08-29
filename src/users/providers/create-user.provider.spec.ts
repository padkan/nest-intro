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
import { MailService } from 'src/mail/providers/mail.service';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

import { ObjectLiteral } from 'typeorm';
import { any } from 'joi';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;
const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  } as MockRepository<T>;
};

describe('CreateUserProvider', () => {
  let provider: CreateUserProvider;
  let userRepository: MockRepository<User>;
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserProvider,
        { provide: DataSource, useValue: {} },
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository<User>(),
        },
        {
          provide: MailService,
          useValue: { sendUserWelcome: jest.fn(() => Promise.resolve()) },
        },
        {
          provide: HashingProvider,
          useValue: { hashPassword: jest.fn(() => user.password) },
        },
      ],
    }).compile();

    provider = module.get<CreateUserProvider>(CreateUserProvider);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('createUser', () => {
    describe('When the user does not exist in database', () => {
      it('should create a new user', async () => {
        if (userRepository.findOne) {
          userRepository.findOne.mockResolvedValue(null);
        }
        if (userRepository.create) {
          userRepository.create.mockReturnValue(user);
        }
        if (userRepository.save) {
          userRepository.save.mockResolvedValue(user);
        }
        const result = await provider.createUser(user as CreateUserDto);
        expect(userRepository.findOne).toHaveBeenCalledTimes(1);
        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: { email: user.email },
        });
        expect(userRepository.create).toHaveBeenCalledTimes(1);
        expect(userRepository.save).toHaveBeenCalledTimes(1);
        expect(result).toEqual(user);
      });

      describe('When the user already exists in database', () => {
        it('throw BadRequestException', async () => {
          if (userRepository.findOne) {
            userRepository.findOne.mockReturnValue(user);
          }
          if (userRepository.create) {
            userRepository.create.mockReturnValue(user);
          }
          if (userRepository.save) {
            userRepository.save.mockResolvedValue(user);
          }
          try {
            await provider.createUser(user as CreateUserDto);
          } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
          }
        });
      });
    });
  });
});
