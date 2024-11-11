import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export const getCodeFormSchema = () =>
  yupResolver(
    yup.object({
      codeListId: yup
        .string()
        .trim()
        .required('코드 아이디를 입력해주세요.')
        .min(2, '최소 2자 이상 입력해주세요.'),

      codeListName: yup
        .string()
        .trim()
        .required('코드 이름을 입력해주세요.')
        .min(2, '최소 2자 이상 입력해주세요.'),

      codeListDescript: yup
        .string()
        .trim()
        .required('코드 설명을 입력해주세요.')
        .min(2, '최소2자 이상 입력해주세요.'),
    })
  );
