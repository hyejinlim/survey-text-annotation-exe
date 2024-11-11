import api from '~/api';

export const fetchMenuList = async () => {
  const { response, error } = await api({
    method: 'get',
    url: `/config/getSideMenuList`,
  });

  return {
    response,
    error,
  };
};
