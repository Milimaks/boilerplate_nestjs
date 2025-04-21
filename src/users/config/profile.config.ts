import { registerAs } from '@nestjs/config';

// This file is used to register the profile configuration for the application.
export default registerAs('profileConfig', () => ({
  apiKey: process.env.PROFILE_API_KEY,
}));
