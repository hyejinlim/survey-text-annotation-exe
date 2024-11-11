import api from '~/api';

export const fetchContentsSelectInfo = async () => {
  const { response, error } = await api({
    method: 'get',
    url: `/contents/getContentsSelectInfo`,
  });

  return {
    response,
    error,
  };
};
