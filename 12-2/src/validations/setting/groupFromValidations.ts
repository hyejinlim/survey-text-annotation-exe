import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export const getGroupFormSchema = () =>
  yupResolver(
    yup.object({
      groupName: yup
        .string()
        .required('그룹이름을 입력해주세요.')
        .trim()
        .min(2, '최소 2자 입력해주세요.'),
    })
  );
