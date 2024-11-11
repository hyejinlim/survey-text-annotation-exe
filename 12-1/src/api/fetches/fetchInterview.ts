import api from '~/api';

/**
 * 임시파일 업로드
 */
export const fetchInterviewFileUpload = async (data: any) => {
  const { response, error } = await api({
    method: 'post',
    url: '/interview/fileUpload',
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
export const fetchInterviewFileInsert = async (data: any) => {
  const { response, error } = await api({
    method: 'post',
    url: '/interview/insert',
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
export const fetchInterviewList = async (params: any) => {
  const { response, error } = await api({
    method: 'get',
    url: '/interview/clist',
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
export const fetchInterviewListSelectInfo = async () => {
  const { response, error } = await api({
    method: 'get',
    url: `/interview/select/list`,
  });

  return {
    response,
    error,
  };
};

/**
 * 원시데이터 삭제
 */
export const fetchInterviewDelete = async (params: any) => {
  const { interviewId } = params;
  const { response, error } = await api({
    method: 'delete',
    url: `/interview/delete/${interviewId}`,
  });

  return {
    response,
    error,
  };
};

/**
 * 원시데이터 상세
 */
export const fetchInterviewDetailData = async (params: any) => {
  const { interviewId } = params;
  const { response, error } = await api({
    method: 'get',
    url: `/interview/view/${interviewId}`,
  });

  return {
    response,
    error,
  };
};

/**
 * 원시데이터 상세 셀렉트 정보
 */
export const fetchInterviewDetailSelectInfo = async () => {
  const { response, error } = await api({
    method: 'get',
    url: '/interview/select/view',
  });

  return {
    response,
    error,
  };
};

/**
 * 원시데이터 상세 수정
 */
export const fetchInterviewDetailDataModify = async (data: any) => {
  const { interviewId, ...rest } = data;
  const { response, error } = await api({
    method: 'patch',
    url: `/interview/update/${interviewId}`,
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
export const fetchInterviewStatusModify = async (data: any) => {
  const { interviewId, ...rest } = data;
  const { response, error } = await api({
    method: 'patch',
    url: `/interview/updateStatus/${interviewId}`,
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
export const fetchInterviewToolList = async (params: any) => {
  const { response, error } = await api({
    method: 'get',
    url: '/interview/tlist',
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
export const fetchInterviewLabeling = async (params: any) => {
  const { interviewId } = params;
  const { response, error } = await api({
    method: 'get',
    url: `/interview/labeling/${interviewId}`,
  });

  return {
    response,
    error,
  };
};

/**
 * 가공툴 라벨링 셀렉트 정보
 */
export const fetchInterviewLabelingSelectInfo = async () => {
  const { response, error } = await api({
    method: 'get',
    url: '/interview/select/tool',
  });

  return {
    response,
    error,
  };
};

/**
 * 가공툴 라벨링 생성
 */
export const fetchInterviewLabelingCreate = async (data: any) => {
  const { interviewId, ...rest } = data;
  const { response, error } = await api({
    method: 'patch',
    url: `/interview/insertLabeling/${interviewId}`,
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
export const fetchInterviewLabelingModify = async (data: any) => {
  const { interviewId, labelingId, ...rest } = data;
  const { response, error } = await api({
    method: 'patch',
    url: `/interview/updateLabeling/${interviewId}/${labelingId}`,
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
export const fetchInterviewLabelingDelete = async (params: any) => {
  const { interviewId, labelingId } = params;
  const { response, error } = await api({
    method: 'delete',
    url: `/interview/deleteLabeling/${interviewId}/${labelingId}`,
  });

  return {
    response,
    error,
  };
};

/**
 * 1차 검수 리스트
 */
export const fetchInterviewI1List = async (params: any) => {
  const { response, error } = await api({
    method: 'get',
    url: '/interview/i1list',
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
export const fetchInterviewI2List = async (params: any) => {
  const { response, error } = await api({
    method: 'get',
    url: '/interview/i2list',
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
export const fetchInterviewIFList = async (params: any) => {
  const { response, error } = await api({
    method: 'get',
    url: '/interview/iflist',
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
export const fetchInterviewInspectionListSelectInfo = async (params: any) => {
  const { type } = params;
  const { response, error } = await api({
    method: 'get',
    url: `/interview/select/list/${type}`,
  });

  return {
    response,
    error,
  };
};

/**
 * 검수데이터 상세
 */
export const fetchInterviewInspectionDetailData = async (params: any) => {
  const { type, interviewId } = params;
  const { response, error } = await api({
    method: 'get',
    url: `/interview/inspection/${type}/${interviewId}`,
  });

  return {
    response,
    error,
  };
};

/**
 * 검수데이터 검수 상태 셀렉트 정보
 */
export const fetchInterviewInspectionSelectInfo = async (params: any) => {
  const { type } = params;
  const { response, error } = await api({
    method: 'get',
    url: `/interview/select/inspection/${type}`,
  });

  return {
    response,
    error,
  };
};

/**
 * 상위 검수자 요청
 */
export const fetchInterviewRequestInspection = async (params: any) => {
  const { interviewId } = params;
  const { response, error } = await api({
    method: 'patch',
    url: `/interview/requestInspection/${interviewId}`,
  });

  return {
    response,
    error,
  };
};

/**
 * 수정 완료
 */
export const fetchInterviewComplete = async (params: any) => {
  const { type, interviewId } = params;
  const { response, error } = await api({
    method: 'patch',
    url: `/interview/compl/${type}/${interviewId}`,
  });

  return {
    response,
    error,
  };
};
