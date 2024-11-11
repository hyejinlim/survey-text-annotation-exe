import api from '~/api';
import { FetchLoginRequest, FetchRegisterRequest } from './types';

export const fetchRegister = async (newUser: FetchRegisterRequest) => {
  const { response, error } = await api({
    method: 'post',
    url: '/member/insertMember',
    data: newUser,
  });

  return {
    response,
    error,
  };
};
export const fetchLogin = async (loginUser: FetchLoginRequest) => {
  const { response, error } = await api({
    method: 'post',
    url: '/member/login',
    data: loginUser,
  });

  return {
    response,
    error,
  };
};
