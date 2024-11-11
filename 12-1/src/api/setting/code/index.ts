import api from '~/api';
import { FetchCodeType } from './types';

export const fetchCodeList = async () => {
  const { response, error } = await api({
    method: 'get',
    url: '/config/getCodeList',
    params: {
      paging: false,
    },
  });

  return {
    response,
    error,
  };
};

export const fetchCreateCode = async (addCode: FetchCodeType) => {
  const { response, error } = await api({
    method: 'post',
    url: '/config/insertCodeList',
    data: addCode,
  });

  return {
    response,
    error,
  };
};

export const fetchModifyCode = async (updateCode: FetchCodeType) => {
  const { response, error } = await api({
    method: 'patch',
    url: '/config/updateCodeList',
    data: updateCode,
  });

  return {
    response,
    error,
  };
};
