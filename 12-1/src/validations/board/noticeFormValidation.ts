import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export const getNoticeFormSchema = () =>
  yupResolver(
    yup.object({
      title: yup
        .string()
        .trim()
        .required('제목을 입력해주세요.')
        .min(2, '최소 2자 이상 입력해주세요.'),

      link: yup.string().nullable(),
      category: yup.string().nullable(),
    })
  );
