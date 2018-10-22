import { string } from 'prop-types';
// import { arrayOf, shape, string } from 'prop-types';
// import { dogShape } from './dog';

export const userShape = {
  firstName: string.isRequired,
  lastName: string.isRequired,
  email: string.isRequired,
  // dogs: arrayOf(shape(dogShape)),
};
