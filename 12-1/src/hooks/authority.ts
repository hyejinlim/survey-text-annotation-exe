import { useQuery } from '@tanstack/react-query';
import { fetchCheckAuthority } from '~/api/setting/authority';

// 권한
const useCheckAuthorityQuery = (type: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['authority', type],
    queryFn: () => fetchCheckAuthority(type),
  });

  return { data, isLoading };
};

export { useCheckAuthorityQuery };
