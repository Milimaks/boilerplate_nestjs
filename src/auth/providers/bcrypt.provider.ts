import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class BcryptProvider implements HashingProvider {
  async hashPassword(data: string | Buffer): Promise<string> {
    // Implementation for hashing password using bcrypt
    throw new Error('Method not implemented.');
  }

  async comparePassword(
    data: string | Buffer,
    hashedPassword: string,
  ): Promise<boolean> {
    // Implementation for comparing password using bcrypt
    throw new Error('Method not implemented.');
  }
}
