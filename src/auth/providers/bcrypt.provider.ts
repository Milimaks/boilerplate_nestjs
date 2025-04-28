import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  async hashPassword(password: string | Buffer): Promise<string> {
    // Generate a salt with 10 rounds
    const salt = await bcrypt.genSalt(10);

    return bcrypt.hash(password, salt);
    // Implementation for hashing password using bcrypt
  }

  async comparePassword(
    password: string | Buffer,
    hashedPassword: string,
  ): Promise<boolean> {
    // Compare the password with the hashed password
    return bcrypt.compare(password, hashedPassword);
  }
}
