import api from '~/api';
import { fetchWorkBoardCreateType } from './types';

export const fetchWorkBoard = async (workboardType: string) => {
  const { response, error } = await api({
    method: 'get',
    url: `/config/getWorkboard/${workboardType}`,
  });

  return {
    response,
    error,
  };
};

// 작업 할당 생성
export const fetchWorkBoardCreate = async (
  params: fetchWorkBoardCreateType
) => {
  const { response, error } = await api({
    method: 'post',
    url: `/config/insertWorkboard`,
    data: params,
  });
  return {
    response,
    error,
  };
};

// 작업 할당 삭제
export const fetchWorkBoardDelete = async (workboardId: string) => {
  const { response, error } = await api({
    method: 'delete',
    url: `/config/deleteWorkboard/${workboardId}`,
  });

  return {
    response,
    error,
  };
};
