import api from '~/api';

/**
 * 검수데이터 검수 상태 수정
 */
export const fetchInspectionStatusModify = async (data: any) => {
  const { response, error } = await api({
    method: 'post',
    url: '/inspection/insertInspection',
    data,
  });

  return {
    response,
    error,
  };
};
