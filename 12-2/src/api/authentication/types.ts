export type FetchLoginRequest = {
  memberId: string;
  memberPassword: string;
};

export type FetchRegisterRequest = {
  memberName: string;
  groupCode: string;
} & FetchLoginRequest;
