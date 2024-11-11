import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export const getCodeDetailFormSchema = () =>
  yupResolver(
    yup.object({
      codeDetailId: yup
        .string()
        .trim()
        .required('코드상세 아이디를 입력해주세요.')
        .min(2, '최소 2자 이상 입력해주세요.'),

      codeDetailName: yup
        .string()
        .trim()
        .required('코드상세 이름을 입력해주세요.')
        .min(2, '최소 2자 이상 입력해주세요.'),

      codeDetailDescript: yup
        .string()
        .trim()
        .required('코드상세 설명을 입력해주세요.')
        .min(2, '최소2자 이상 입력해주세요.'),
    })
  );
