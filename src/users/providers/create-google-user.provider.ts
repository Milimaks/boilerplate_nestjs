import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FindOneByGooleIdProvider } from './find-one-by-google-id.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleUser } from '../interfaces/google-user.interface';
import { User } from '../user.entity';

@Injectable()
export class CreateGoogleUserProvider {
  constructor(
    /**
     * Inject usersRepository
     */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async createGoogleUser(googleUser: GoogleUser) {
    try {
      const user = this.usersRepository.create(googleUser);
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Could not create a new user',
      });
    }
  }
}
