import api from '~/api';
import {
  FetchInsertAuthorityFuncionListType,
  FetchInsertAuthorityMenuListType,
} from './types';

export const fetchAuthorityMenuList = async (memberNo: string) => {
  const { response, error } = await api({
    method: 'get',
    url: `/config/getAuthorityMenuList/${memberNo}`,
  });
  return {
    response,
    error,
  };
};

export const fetchInsertAuthorityMenuList = async (
  inserValues: FetchInsertAuthorityMenuListType
) => {
  const { memberNo, insertValue } = inserValues;
  const { response, error } = await api({
    method: 'patch',
    url: `/config/insertAuthorityMenuList/${memberNo}`,
    data: insertValue,
  });

  return {
    response,
    error,
  };
};

export const fetchgetAuthorityFunctionList = async (memberNo: string) => {
  const { response, error } = await api({
    method: 'get',
    url: `/config/getAuthorityFunctionList/${memberNo}`,
  });

  return {
    response,
    error,
  };
};

export const fetchInsertAuthorityFunctionList = async (
  insertValues: FetchInsertAuthorityFuncionListType
) => {
  const { memberNo, insertValue } = insertValues;

  const { response, error } = await api({
    method: 'patch',
    url: `/config/insertAuthorityFunctionList/${memberNo}`,
    data: insertValue,
  });

  return {
    response,
    error,
  };
};

export const fetchCheckAuthority = async (menuId: string) => {
  const { response, error } = await api({
    method: 'get',
    url: `/config/checkAuthority/${menuId}`,
  });

  return {
    response,
    error,
  };
};
