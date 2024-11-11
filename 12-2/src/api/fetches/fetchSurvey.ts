import api from '~/api';

/**
 * 임시파일 업로드
 */
export const fetchSurveyFileUpload = async (data: any) => {
  const { response, error } = await api({
    method: 'post',
    url: '/survey/fileUpload',
    data,
  });

  return {
    response,
    error,
  };
};

/**
 * 파일 업로드
 */
export const fetchSurveyFileInsert = async (data: any) => {
  const { response, error } = await api({
    method: 'post',
    url: '/survey/insert',
    data,
  });

  return {
    response,
    error,
  };
};

/**
 * 원시데이터 리스트
 */
export const fetchSurveyList = async (params: any) => {
  const { response, error } = await api({
    method: 'get',
    url: '/survey/clist',
    params,
  });

  return {
    response,
    error,
  };
};

/**
 * 원시데이터 리스트 셀렉트 정보
 */
export const fetchSurveyListSelectInfo = async () => {
  const { response, error } = await api({
    method: 'get',
    url: `/survey/select/list`,
  });

  return {
    response,
    error,
  };
};

/**
 * 원시데이터 삭제
 */
export const fetchSurveyDelete = async (params: any) => {
  const { surveyId } = params;
  const { response, error } = await api({
    method: 'delete',
    url: `/survey/delete/${surveyId}`,
  });

  return {
    response,
    error,
  };
};

/**
 * 원시데이터 상세
 */
export const fetchSurveyDetailData = async (params: any) => {
  const { surveyId } = params;
  const { response, error } = await api({
    method: 'get',
    url: `/survey/view/${surveyId}`,
  });

  return {
    response,
    error,
  };
};

/**
 * 원시데이터 상세 셀렉트 정보
 */
export const fetchSurveyDetailSelectInfo = async () => {
  const { response, error } = await api({
    method: 'get',
    url: `/survey/select/view`,
  });

  return {
    response,
    error,
  };
};

/**
 * 원시데이터 상세 수정
 */
export const fetchSurveyDetailDataModify = async (data: any) => {
  const { surveyId, ...rest } = data;
  const { response, error } = await api({
    method: 'patch',
    url: `/survey/update/${surveyId}`,
    data: rest,
  });

  return {
    response,
    error,
  };
};

/**
 * 원시데이터 작업상태 수정
 */
export const fetchSurveyStatusModify = async (data: any) => {
  const { surveyId, ...rest } = data;
  const { response, error } = await api({
    method: 'patch',
    url: `/survey/updateStatus/${surveyId}`,
    data: rest,
  });

  return {
    response,
    error,
  };
};

/**
 * 가공툴 리스트
 */
export const fetchSurveyToolList = async (params: any) => {
  const { response, error } = await api({
    method: 'get',
    url: '/survey/tlist',
    params,
  });

  return {
    response,
    error,
  };
};

/**
 * 가공툴 라벨링 정보
 */
export const fetchSurveyLabeling = async (params: any) => {
  const { surveyId } = params;
  const { response, error } = await api({
    method: 'get',
    url: `/survey/labeling/${surveyId}`,
  });

  return {
    response,
    error,
  };
};

/**
 * 가공툴 라벨링 셀렉트 정보
 */
export const fetchSurveyLabelingSelectInfo = async () => {
  const { response, error } = await api({
    method: 'get',
    url: `/survey/select/tool`,
  });

  return {
    response,
    error,
  };
};

/**
 * 가공툴 라벨링 생성
 */
export const fetchSurveyLabelingCreate = async (data: any) => {
  const { surveyId, ...rest } = data;
  const { response, error } = await api({
    method: 'patch',
    url: `/survey/insertLabeling/${surveyId}`,
    data: rest,
  });

  return {
    response,
    error,
  };
};

/**
 * 가공툴 라벨링 수정
 */
export const fetchSurveyLabelingModify = async (data: any) => {
  const { surveyId, labelingId, ...rest } = data;
  const { response, error } = await api({
    method: 'patch',
    url: `/survey/updateLabeling/${surveyId}/${labelingId}`,
    data: rest,
  });

  return {
    response,
    error,
  };
};

/**
 * 가공툴 라벨링 삭제
 */
export const fetchSurveyLabelingDelete = async (params: any) => {
  const { surveyId, labelingId } = params;
  const { response, error } = await api({
    method: 'delete',
    url: `/survey/deleteLabeling/${surveyId}/${labelingId}`,
  });

  return {
    response,
    error,
  };
};

/**
 * 1차 검수 리스트
 */
export const fetchSurveyI1List = async (params: any) => {
  const { response, error } = await api({
    method: 'get',
    url: '/survey/i1list',
    params,
  });

  return {
    response,
    error,
  };
};

/**
 * 2차 검수 리스트
 */
export const fetchSurveyI2List = async (params: any) => {
  const { response, error } = await api({
    method: 'get',
    url: '/survey/i2list',
    params,
  });

  return {
    response,
    error,
  };
};

/**
 * 의미정확성 검수 리스트
 */
export const fetchSurveyIFList = async (params: any) => {
  const { response, error } = await api({
    method: 'get',
    url: '/survey/iflist',
    params,
  });

  return {
    response,
    error,
  };
};

/**
 * 원시데이터 리스트 셀렉트 정보
 */
export const fetchSurveyInspectionListSelectInfo = async (params: any) => {
  const { type } = params;
  const { response, error } = await api({
    method: 'get',
    url: `/survey/select/list/${type}`,
  });

  return {
    response,
    error,
  };
};

/**
 * 검수데이터 상세
 */
export const fetchSurveyInspectionDetailData = async (params: any) => {
  const { type, labelingId } = params;
  const { response, error } = await api({
    method: 'get',
    url: `/survey/inspection/${type}/${labelingId}`,
  });

  return {
    response,
    error,
  };
};

/**
 * 검수데이터 검수 상태 셀렉트 정보
 */
export const fetchSurveyInspectionSelectInfo = async (params: any) => {
  const { type } = params;
  const { response, error } = await api({
    method: 'get',
    url: `/survey/select/inspection/${type}`,
  });

  return {
    response,
    error,
  };
};

/**
 * 상위 검수자 요청
 */
export const fetchSurveyRequestInspection = async (params: any) => {
  const { labelingId } = params;
  const { response, error } = await api({
    method: 'patch',
    url: `/survey/requestInspection/${labelingId}`,
  });

  return {
    response,
    error,
  };
};

/**
 * 수정 완료
 */
export const fetchSurveyComplete = async (params: any) => {
  const { type, labelingId } = params;
  const { response, error } = await api({
    method: 'patch',
    url: `/survey/compl/${type}/${labelingId}`,
  });

  return {
    response,
    error,
  };
};
