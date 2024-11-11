import L from 'lodash';
import { InitialValue, WorkFormType } from './constants';
export const getInitialFormValues = (item?: any): WorkFormType => {
  if (!item || L.isEmpty(item)) return InitialValue;

  const { contentsMediaCategory, workboardStart, workboardEnd } = item;
  return {
    contentsMediaCategory,
    workboardStart,
    workboardEnd,
  };
};
