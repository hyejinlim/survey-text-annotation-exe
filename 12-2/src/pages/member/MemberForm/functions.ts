import L from 'lodash';
import { InitialValue, MemberFormType } from './constants';
export const getInitialFormValues = (item?: MemberFormType) => {
  if (!item || L.isEmpty(item)) {
    return InitialValue;
  }

  const { id, password, name, state, groupCode, isAlarm, memo } = item;

  return {
    id,
    password,
    name,
    state,
    groupCode,
    isAlarm,
    memo,
  };
};
