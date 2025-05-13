import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class FindOneByGooleIdProvider {
  constructor(
    /**
     * Inject usersRepository
     */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async findOneByGoogleId(googleId: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: {
        googleId,
      },
    });
  }
}
