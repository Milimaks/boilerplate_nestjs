import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123456',
  database: 'test-database',
  entities: ['**/*.entity.js'],
  migrations: ['migrations/*{.ts,.js}'],
});
