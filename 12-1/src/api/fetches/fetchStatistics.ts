import api from '~/api';

type StatisticsCardDetailType = {
  type: string | number;
  mid?: string | undefined;
};

type StatisticsCalendarType = {
  mid: string | undefined;
  date: { year: string; month: string };
};

export const fetchSurveyStatisticsCard = async (mid?: string) => {
  const endPoint = mid ? `/${mid}` : '';
  const { response, error } = await api({
    method: 'get',
    url: `/statistics/survey/card${endPoint}`,
  });

  return {
    response,
    error,
  };
};

export const fetchSurveyStatisticsCardDetail = async (
  types: StatisticsCardDetailType
) => {
  const endPoint = types ? '/'.concat(Object.values(types).join('/')) : '';
  const { response, error } = await api({
    method: 'get',
    url: `/statistics/survey/detail${endPoint}`,
  });

  return {
    response,
    error,
  };
};

export const fetchInterviewStatisticsCard = async (mid?: string) => {
  const endPoint = mid ? `/${mid}` : '';
  const { response, error } = await api({
    method: 'get',
    url: `/statistics/interview/card${endPoint}`,
  });

  return {
    response,
    error,
  };
};

export const fetchInterviewStatisticsCardDetail = async (
  types: StatisticsCardDetailType
) => {
  const endPoint = types ? '/'.concat(Object.values(types).join('/')) : '';
  const { response, error } = await api({
    method: 'get',
    url: `/statistics/interview/detail${endPoint}`,
  });

  return {
    response,
    error,
  };
};

export const fetchStatisticsCalendar = async (
  calendarData: StatisticsCalendarType
) => {
  const { date, mid } = calendarData;
  const { response, error } = await api({
    method: 'get',
    url: `/statistics/statisticsCalendar/${mid}`,
    params: date,
  });

  return {
    response,
    error,
  };
};
