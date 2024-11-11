import api from '~/api';
import { FetchCreateGroupType, FetchModifyUsedGroupType } from './types';

export const fetchGroupList = async (parentsCode?: string) => {
  const endPoint = parentsCode ? `/${parentsCode}` : '';
  const { response, error } = await api({
    method: 'get',
    url: `/config/getGroupList${endPoint}`,
  });

  const res = response.payload.map((item: any) => {
    const { groupId, groupName } = item;
    return {
      label: groupName,
      value: groupId,
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

export const fetchGroup = async (parentsCode?: string) => {
  const { response, error } = await api({
    method: 'get',
    url: `/config/getGroupList/${parentsCode ?? ''}`,
  });

  const res = response.payload.map((item: any) => {
    const { groupId, child, groupName, groupOpenTF } = item;
    return {
      id: groupId,
      child: child,
      label: groupName,
      used: groupOpenTF,
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

export const fetchCreatGroup = async (addGroup: FetchCreateGroupType) => {
  const { response, error } = await api({
    method: 'post',
    url: `/config/insertGroup`,
    data: addGroup,
  });

  return {
    response,
    error,
  };
};

/** 업데이트 그룹 이름 */
export const fetchModifyGroup = async (editGroup: FetchCreateGroupType) => {
  const { response, error } = await api({
    method: 'patch',
    url: `/config/updateGroup`,
    data: editGroup,
  });

  return {
    response,
    error,
  };
};

/** 복구 관련된 api 로직 */
export const fetchModifyUsedGroup = async (
  usedGroup: FetchModifyUsedGroupType
) => {
  const { response, error } = await api({
    method: 'patch',
    url: `/config/updateGroupOpen`,
    data: usedGroup,
  });

  return {
    response,
    error,
  };
};

export const fetchAuthorityGroup = async () => {
  const { response, error } = await api({
    method: 'get',
    url: `/config/getGroupMemberList`,
  });

  return {
    response,

    error,
  };
};
