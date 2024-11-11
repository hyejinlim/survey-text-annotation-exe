import api from '~/api';

/**
 * 카테고리 조회
 */
export const fetchLabelingCategory = async () => {
  const { response, error } = await api({
    method: 'get',
    url: `/contents/getToolSelectedList`,
  });

  return {
    response,
    error,
  };
};

/**
 * 카테고리별 문서 조회
 */
export const fetchLabelingDocument = async (params: any) => {
  const { labelingYN } = params;
  const { response, error } = await api({
    method: 'get',
    url: `/contents/getToolList`,
    params,
  });

  const res = response.payload.reduce((acc: any, cur: any) => {
    const data = {
      ...cur,
      hasLabeling: labelingYN === 'Y' ? true : false,
    };
    return [...acc, data];
  }, []);

  return {
    response: {
      ...response,
      payload: res,
    },
    error,
  };
};

/**
 * 메타데이터 조회
 */
export const fetchLabelingMetaData = async (params: any) => {
  const { contentsId, ...rest } = params;
  const { response, error } = await api({
    method: 'get',
    url: `/contents/getContentsInfo/${contentsId}`,
    params: rest,
  });

  return {
    response,
    error,
  };
};

/**
 * 라벨링 데이터 저장
 */
export const fetchLabelingCreate = async (params: any) => {
  const { contentsId, labeling } = params;

  const { response, error } = await api({
    method: 'patch',
    url: `/labeling/insertTextLabeling/${contentsId}`,
    data: labeling,
  });
  return {
    response,
    error,
  };
};

/**
 * 라벨링 작업 로그
 */
export const fetchLabelingLog = async (params: { imageId: number }) => {
  const { imageId } = params;
  const { response, error } = await api({
    method: 'get',
    url: `/contents/getLog/${imageId}`,
  });
  return {
    response,
    error,
  };
};

/**
 * 라벨링 리스트 조회
 */
export const fetchLabelingList = async (params: any) => {
  const { response, error } = await api({
    method: 'get',
    url: `/labeling/list`,
    params,
  });

  const res = response.payload.map((item: any) => {
    const { contentsId, inspectionValue, inspectionValueName, ...rest } = item;
    return {
      id: contentsId,
      ...rest,
      results: { label: inspectionValueName, value: inspectionValue },
    };
  });

  return {
    response: {
      ...response,
      payload: res,
    },
    error,
  };
};

/**
 * 라벨링 검수 조회
 */
export const fetchLabelingInspection = async (params: { imageId: number }) => {
  const { imageId } = params;
  const { response, error } = await api({
    method: 'get',
    url: `/inspection/getInspectionList/labeling/${imageId}`,
  });

  return {
    response,
    error,
  };
};

/**
 * 라벨링 검수 수정
 */
export const fetchLabelingInspectionUpdate = async (params: any) => {
  const { response, error } = await api({
    method: 'post',
    url: `/inspection/insertInspection`,
    data: params,
  });

  return {
    response,
    error,
  };
};
