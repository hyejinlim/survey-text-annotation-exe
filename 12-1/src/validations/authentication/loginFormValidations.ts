import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export const getLoginFormSchema = () =>
  yupResolver(
    yup.object({
      id: yup
        .string()
        .required('아이디를 입력해주세요.')
        .email('이메일 형식을 확인해주세요.'),
      password: yup
        .string()
        .required('비밀번호를 입력해주세요.')
        .min(6, '최소 6자 이상 입력해주세요.')
        .max(15, '최대 15자를 입력해주세요.')
        .matches(
          /^.*(?=^.{6,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[~`!@#$%^&*()-+=]).*$/,
          '영문, 숫자, 특수문자 6자~15자 혼합하여 생성해주세요'
        ),
    })
  );
