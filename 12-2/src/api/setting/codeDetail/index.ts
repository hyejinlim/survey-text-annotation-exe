import api from '~/api';
import { FetchCodeDetailType, FetchCodeDetailListType } from './types';

export const fetchCodeDetailList = async (params: FetchCodeDetailListType) => {
  const { codeDetailList } = params;
  const { response, error } = await api({
    method: 'get',
    url: `/config/getCodeDetail`,
    params,
  });

  if (codeDetailList) {
    return { response, error };
  } else {
    const res = response.payload.map((item: any) => {
      const { codeDetailName, codeDetailId } = item;
      return {
        label: codeDetailName,
        value: codeDetailId,
      };
    });

    return {
      response: {
        ...response,
        payload: res,
      },
      error,
    };
  }
};

export const fetchCodeDetailCreate = async (params: FetchCodeDetailType) => {
  const { response, error } = await api({
    method: 'post',
    url: `/config/insertCodeDetail`,
    data: params,
  });

  return {
    response,
    error,
  };
};

export const fetchCodeDetailModify = async (params: FetchCodeDetailType) => {
  const { response, error } = await api({
    method: 'patch',
    url: '/config/updateCodeDetail',
    data: params,
  });

  return {
    response,
    error,
  };
};

export const fetchModifyCodeDetailOpen = async (
  params: FetchCodeDetailType
) => {
  const { response, error } = await api({
    method: 'patch',
    url: '/config/updateCodeDetailOpen',
    data: params,
  });

  return {
    response,
    error,
  };
};
