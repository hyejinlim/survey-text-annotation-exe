import {
  FunctionType,
  MenuType,
} from '~/components/setting/GroupAuthority/Authority/types';

export type FetchInsertAuthorityMenuListType = {
  memberNo: string;
  insertValue: MenuType[];
};

export type FetchInsertAuthorityFuncionListType = {
  memberNo: string;
  insertValue: FunctionType[];
};
