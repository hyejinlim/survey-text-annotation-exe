import L from 'lodash';
import { InitialValue, CodeDetailFormType } from './constants';

export const getInitialFormValues = (item?: any): CodeDetailFormType => {
  if (!item || L.isEmpty(item)) return InitialValue;

  const { codeDetailId, codeDetailName, codeDetailDescript } = item;
  return {
    codeDetailId,
    codeDetailName,
    codeDetailDescript,
  };
};
