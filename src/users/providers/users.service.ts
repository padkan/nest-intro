import { Repository } from 'typeorm';
import { AuthService } from './../../auth/providers/auth.service';
import { GetUsersParamDto } from './../dtos/get-users-param.dto';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig, { ProfileConfigType } from '../config/profile.config';

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
  ) {}

  public async createUser(createUserDto: any) {
    // check email duplicatio
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    //exception error
    //create a user
    let newUser = this.userRepository.create(createUserDto);
    newUser = await this.userRepository.save(newUser);
    return newUser;
  }

  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    // Use configService to get S3 bucket name
    const s3Bucket = this.configService.get<string>('S3_BUCKET');
    console.log(`S3 Bucket: ${s3Bucket}`);

    console.log(`Profile API Key: ${this.profileConfig.apiKey}`);

    // Use authService to check if the user is authenticated
    const isAuth = this.authService.isAuth();
    console.log(`Is Authenticated: ${isAuth}`);
    console.log(`Params: `, getUsersParamDto);
    console.log(getUsersParamDto);
    console.log(`Limit: ${limit}, Page: ${page}`);
    return [
      { name: 'John', email: 'john@example.com' },
      { name: 'Jane', email: 'jane@example.com' },
    ];
  }

  public async findOneById(id: number) {
    return await this.userRepository.findOneBy({
      id,
    });
  }
}
