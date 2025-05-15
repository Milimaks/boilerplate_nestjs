import { faker } from '@faker-js/faker';

export const completeUser = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: 'Password123#',
};

export const missionFirstName = {
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: 'Password123#',
};
export const missionEmail = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  password: 'Password123#',
};
export const missionPassword = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
};
