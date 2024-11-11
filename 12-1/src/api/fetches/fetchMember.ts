import api from '~/api';

export type FetchInsertMemberType = {
  memberNo?: number;
  memberPassword: string;
  memberId: string;
  groupCode: string;
  memberStatus: string;
  memberMemo: string;
  memberName: string;
  memberPushTF: boolean;
};

export const fetchMemberListStatus = async (status: string) => {
  const endPoint = status ? `/${status}` : '';
  const { response, error } = await api({
    method: 'get',
    url: `/member/list${endPoint}`,
  });

  return {
    response,
    error,
  };
};

export const fetchInsertMember = async (params: FetchInsertMemberType) => {
  const { response, error } = await api({
    method: 'post',
    url: `/member/insertMember`,
    data: params,
  });

  return {
    response,
    error,
  };
};

export const fetchMemberInfo = async (mid?: string) => {
  const { response, error } = await api({
    method: 'get',
    url: `/member/info/${mid}`,
  });

  const {
    createDatetime,
    groupCode,
    groupCode1,
    groupCode2,
    memberId,
    memberLastLoginDatetime,
    memberMemo,
    memberName,
    memberNo,
    memberStatus,
    memberPushTF,
    groupCode1List,
    groupCode2List,
    groupCodeList,
  } = response.payload.info;

  const largeGroupValue = groupCode1List.map((item: any) => {
    const { groupId, groupName } = item;
    return { label: groupName, value: groupId };
  });

  const groupCode2Value = groupCode2List.map((item: any) => {
    const { groupId, groupName } = item;
    return { label: groupName, value: groupId };
  });

  const groupCodeValue = groupCodeList.map((item: any) => {
    const { groupId, groupName } = item;
    return { label: groupName, value: groupId };
  });

  const res = {
    largeGroup: groupCode1,
    middleGroup: groupCode2,
    groupCode2List: groupCode2Value,
    groupCode1List: largeGroupValue,
    groupCodeList: groupCodeValue,
    groupCode,
    memberName,
    memberNo,
    memberLastLoginDatetime,
    createDatetime,
    memo: memberMemo,
    name: memberName,
    state: memberStatus.value,
    id: memberId,
    isAlarm: memberPushTF,
  };

  return {
    response: {
      ...response,
      payload: res,
    },
    error,
  };
};
