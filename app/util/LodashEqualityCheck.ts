import _ from 'lodash';

export const checkEqual = (left: any, right: any) => {
  return _.isEqual(left, right);
};
