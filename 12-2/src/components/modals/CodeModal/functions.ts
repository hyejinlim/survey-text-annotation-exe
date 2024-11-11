import L from 'lodash';
import { InitialValue, CodeFormType } from './constants';

export const getInitialFormValues = (item?: any): CodeFormType => {
  if (!item || L.isEmpty(item)) return InitialValue;

  const { codeListId, codeListName, codeListDescript } = item;
  return {
    codeListId,
    codeListName,
    codeListDescript,
  };
};
