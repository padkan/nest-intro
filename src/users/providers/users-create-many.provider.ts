import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateUserManyDto } from '../dtos/create-user-many.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly datasource: DataSource) {}

  public async createMany(createUserManyDto: CreateUserManyDto) {
    const newUsers: User[] = [];
    // Create query Runner instance
    const queryRunner = this.datasource.createQueryRunner();
    try {
      // connect query Runner to datasource
      await queryRunner.connect();
      // start transaction
      await queryRunner.startTransaction();
    } catch (error) {
      // handle connection or transaction start error
      console.error(
        'Error connecting to the database or starting transaction:',
        error,
      );
      throw new RequestTimeoutException(
        'Error connecting to the database or starting transaction',
      );
    }

    try {
      for (const user of createUserManyDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      // if successful commit
      await queryRunner.commitTransaction();
    } catch (error) {
      // if unsuccessful rollback
      await queryRunner.rollbackTransaction();
      throw new ConflictException('could not complete the transaction', {
        description: String(error),
      });
    } finally {
      try {
        // release the query runner
        await queryRunner.release();
      } catch (error) {
        console.error('Error releasing query runner:', String(error));
      }
    }
    return newUsers; // Return the newly created users
  }
}
