import { instanceOf, string } from 'prop-types';

export const dogShape = {
  name: string,
  breed: string,
  sex: string,
  birthday: instanceOf(Date),
};
