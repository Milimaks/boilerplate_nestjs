import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  // The refresh token string
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
