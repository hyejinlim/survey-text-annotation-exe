import api from '~/api';

export type FetchInsertNoticeType = {
  noticeId: string | number;
  noticeTitle: string;
  noticeContents: any;
};

export type FetchInsertCommentType = {
  noticeId: string | undefined;
  commentId: string | number;
  commentTitle: string;
  commentContents: string;
};

export type FetchBoardStateType = {
  noticeId: number;
  noticeStep: number;
};

export const fetchNoticeList = async () => {
  const { response, error } = await api({
    method: 'get',
    url: '/notice/getNoticeList',
  });

  return {
    response,
    error,
  };
};

// 생성
export const fetchInsertNotice = async (data: FetchInsertNoticeType) => {
  const { response, error } = await api({
    method: 'post',
    url: '/notice/insertNotice',
    data,
  });

  return {
    response,
    error,
  };
};

export const fetchBoardDetail = async (boardId?: string) => {
  const { response, error } = await api({
    method: 'get',
    url: `/notice/getNoticeInfo/${boardId}`,
  });

  const { id, title, contents, comment, file, link, category } =
    response.payload.info;
  const res = {
    id,
    title,
    text: contents,
    comment,
    file,
    link,
    category: category.value,
  };

  return {
    response: {
      ...response,
      payload: res,
    },
    error,
  };
};

// 댓글 추가
export const fetchInsertComment = async (data: FetchInsertCommentType) => {
  const { response, error } = await api({
    method: 'post',
    url: '/notice/insertNoticeComment',
    data,
  });

  return {
    response,
    error,
  };
};

// 파일 첨부
export const fetchBoardFileUpload = async (data: any) => {
  const { response, error } = await api({
    method: 'post',
    url: '/notice/singleFileUpload',
    data,
  });

  return {
    response,
    error,
  };
};

export const fetchQnaList = async () => {
  const { response, error } = await api({
    method: 'get',
    url: '/notice/getSuggestList',
  });

  return {
    response,
    error,
  };
};

// 생성, 수정
export const fetchInsertQna = async (data: any) => {
  const { response, error } = await api({
    method: 'post',
    url: '/notice/insertSuggest',
    data: data,
  });

  return {
    response,
    error,
  };
};

export const fetchBoardState = async (data: FetchBoardStateType) => {
  const { response, error } = await api({
    method: 'patch',
    url: '/notice/updateNoticeState',
    data,
  });

  return {
    response,
    error,
  };
};

// 댓글 삭제
export const fetchDeleteComment = async (commentId: string) => {
  const { response, error } = await api({
    method: 'delete',
    url: `/notice/deleteNoticeComment/${commentId}`,
  });

  return {
    response,
    error,
  };
};
