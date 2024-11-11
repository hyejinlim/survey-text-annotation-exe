import { useMutation } from '@tanstack/react-query';
import { fetchInsertMember } from '~/api/fetches/fetchMember';

const useInsertMember = () => {
  return useMutation({ mutationFn: fetchInsertMember });
};

export { useInsertMember };
