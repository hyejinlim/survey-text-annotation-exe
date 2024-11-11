import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export const getQnaFormSchema = () =>
  yupResolver(
    yup.object({
      id: yup.string().trim().nullable(),
      title: yup
        .string()
        .trim()
        .required('제목을 입력해주세요.')
        .min(2, '최소 2자 이상 입력해주세요.'),
      text: yup
        .string()
        .trim()
        .required('내용을 입력해주세요.')
        .min(2, '최소 2자 이상 입력해주세요.'),
    })
  );
