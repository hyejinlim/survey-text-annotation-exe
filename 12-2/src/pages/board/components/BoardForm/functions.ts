import L from 'lodash';
import { InitialValue, BoardFormType } from './constants';
export const getInitialFormValues = (item?: any): BoardFormType => {
  if (!item || L.isEmpty(item)) {
    return InitialValue;
  }

  const { title, text, category, link } = item;

  return {
    title,
    text,
    category,
    link,
  };
};
