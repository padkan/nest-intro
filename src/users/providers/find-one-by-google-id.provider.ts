import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneByGoogleIdProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findOneByGoogleId(googleId: string): Promise<User | null> {
    try {
      return await this.userRepository.findOneBy({ googleId });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error finding user by Google ID',
      });
    }
  }
}
