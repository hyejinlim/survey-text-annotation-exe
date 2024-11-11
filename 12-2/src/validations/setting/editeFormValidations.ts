import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export const getEditeFormSchema = (isEditMode = false) =>
  yupResolver(
    yup.object({
      id: isEditMode
        ? yup.string().nullable()
        : yup.string().trim().required('아이디를 입력해주세요.'),
      name: yup.string().trim().required('이름을 입력해주세요.'),
      used: yup.boolean(),
    })
  );
