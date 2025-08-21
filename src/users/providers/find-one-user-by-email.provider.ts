import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findOneByEmail(email: string): Promise<User | null | undefined> {
    let user: User | undefined = undefined;
    try {
      const result = await this.userRepository.findOne({ where: { email } });
      user = result ?? undefined; // convert null → undefined
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error finding user by email',
      });
    }

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return user;
  }
}
