export type FetchCodeDetailType = {
  codeDetailDescript: string;
  codeDetailId: string;
  codeDetailName: string;
  codeListId: string | undefined;
  codeDetailOpenTF?: boolean;
};

export type FetchCodeDetailListType = {
  paging?: boolean;
  codeListId?: string;
  codeDetailOpen?: string;
  codeDetailList?: boolean;
};
