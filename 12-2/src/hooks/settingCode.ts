import { useQuery } from '@tanstack/react-query';
import { fetchCodeDetailList } from '~/api/setting/codeDetail';

// 상세 코드 리스트
const useCodeDetailListQuery = (params?: any) => {
  const { data, refetch } = useQuery({
    queryKey: ['codeDetailList', params],
    queryFn: () => fetchCodeDetailList(params),
  });

  return { data, refetch };
};

export { useCodeDetailListQuery };
