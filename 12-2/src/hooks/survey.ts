import { useQuery } from '@tanstack/react-query';
import {
  fetchSurveyDetailData,
  fetchSurveyInspectionDetailData,
  fetchSurveyListSelectInfo,
} from '~/api/fetches/fetchSurvey';

// GET 데이터
const useSurveyDetailDataQuery = (surveyId: string | number) => {
  const { data, isLoading } = useQuery({
    queryKey: ['surveyDetailData', surveyId],
    queryFn: () =>
      fetchSurveyDetailData({ surveyId }).then(
        ({ response }) => response.payload
      ),
    enabled: !!surveyId,
  });

  return { data, isLoading };
};

// 12-1 원시데이터 리스트 셀렉트 정보
const useSurveyListSelectInfoQuery = () => {
  const { data } = useQuery({
    queryKey: ['surveyListSelectInfo'],
    queryFn: fetchSurveyListSelectInfo,
  });
  return { data };
};

// 12-1 검수 데이터 상세
const useSurveyInspectionDetailDataQuery = ({ type, labelingId }: any) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['surveyInspectionDetailData', type, labelingId],
    queryFn: () =>
      fetchSurveyInspectionDetailData({ type, labelingId }).then(
        ({ response }) => response.payload
      ),
    enabled: !!labelingId && !!type,
  });

  return { data, isLoading, refetch };
};

export {
  useSurveyDetailDataQuery,
  useSurveyListSelectInfoQuery,
  useSurveyInspectionDetailDataQuery,
};
