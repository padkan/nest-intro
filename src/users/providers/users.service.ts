import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from './../../auth/providers/auth.service';
import { GetUsersParamDto } from './../dtos/get-users-param.dto';
import {
  Injectable,
  forwardRef,
  Inject,
  RequestTimeoutException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig, { ProfileConfigType } from '../config/profile.config';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateUserManyDto } from '../dtos/create-user-many.dto';
import { CreateUserProvider } from './create-user.provider';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    // inject user repository
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private configService: ConfigService,
    @Inject(profileConfig.KEY)
    private readonly profileConfig: ProfileConfigType,

    private readonly datasource: DataSource,
    private readonly usersCreateManyProvider: UsersCreateManyProvider,
    private readonly createUserProvider: CreateUserProvider,
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'the API endpoint does not exist',
        fileName: 'users.service.ts',
        lineNumber: 74,
      },
      HttpStatus.MOVED_PERMANENTLY,
      // this is not pass to client
      {
        cause: new Error(),
        description: 'the API endpoint does not exist',
      },
    );
    // Use configService to get S3 bucket name
    // const s3Bucket = this.configService.get<string>('S3_BUCKET');
    // console.log(`S3 Bucket: ${s3Bucket}`);
    // console.log(`Profile API Key: ${this.profileConfig.apiKey}`);
    // Use authService to check if the user is authenticated
    // const isAuth = this.authService.isAuth();
    // console.log(`Is Authenticated: ${isAuth}`);
    // console.log(`Params: `, getUsersParamDto);
    // console.log(getUsersParamDto);
    // console.log(`Limit: ${limit}, Page: ${page}`);
    // return [
    //   { name: 'John', email: 'john@example.com' },
    //   { name: 'Jane', email: 'jane@example.com' },
    // ];
  }

  public async findOneById(id: number) {
    let user = undefined;
    try {
      user = await this.userRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  public async createMany(createUserManyDto: CreateUserManyDto) {
    return await this.usersCreateManyProvider.createMany(createUserManyDto);
  }

  public async findOneByEmail(email: string): Promise<User | null | undefined> {
    return this.findOneUserByEmailProvider.findOneByEmail(email);
  }
}
