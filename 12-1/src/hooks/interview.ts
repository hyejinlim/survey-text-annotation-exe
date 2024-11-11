import { useQuery } from '@tanstack/react-query';
import {
  fetchInterviewDetailData,
  fetchInterviewInspectionDetailData,
  fetchInterviewListSelectInfo,
} from '~/api/fetches/fetchInterview';

// GET 데이터
const useInterviewDetailDataQuery = (interviewId: string | number) => {
  const { data, isLoading } = useQuery({
    queryKey: ['interviewDetailData', interviewId],
    queryFn: () =>
      fetchInterviewDetailData({ interviewId }).then(
        ({ response }) => response.payload
      ),
    enabled: !!interviewId,
  });

  return { data, isLoading };
};

// 12-2 원시데이터 리스트 셀렉트 정보
const useInterviewListSelectInfoQuery = () => {
  const { data } = useQuery({
    queryKey: ['interviewListSelectInfo'],
    queryFn: fetchInterviewListSelectInfo,
  });

  return { data };
};

// 12-2 검수 데이터 상세
const useInterviewInspectionDetailDataQuery = ({ type, interviewId }: any) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['interviewInspectionDetailData', type, interviewId],
    queryFn: () =>
      fetchInterviewInspectionDetailData({ type, interviewId }).then(
        ({ response }) => response
      ),
    enabled: !!interviewId && !!type,
  });

  return { data, isLoading, refetch };
};

export {
  useInterviewDetailDataQuery,
  useInterviewListSelectInfoQuery,
  useInterviewInspectionDetailDataQuery,
};
