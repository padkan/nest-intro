import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { GoogleUser } from '../interfaces/google-user.interface';
@Injectable()
export class CreateGoogleUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //between service transfer data instead of dto I use interface
  public async createGoogleUser(googleUser: GoogleUser): Promise<User> {
    try {
      const user = this.userRepository.create(googleUser);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Could not Create a New User',
      });
    }
  }
}
