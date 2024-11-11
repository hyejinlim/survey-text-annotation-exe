import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export const getWorkboardFormSchema = () =>
  yupResolver(
    yup.object({
      contentsMediaCategory: yup
        .string()
        .required('매체 분류를 한개 이상 선택해주세요.'),
      workboardStart: yup
        .number()
        .moreThan(0, '시작 일련번호는 0보다 커야 합니다.')
        .required('시작 일련번호를 입력해주세요.')
        .typeError('숫자를 입력해주세요.')
        .integer('정수를 입력해주세요.')
        .when('workboardEnd', (endValue, schema) => {
          return schema.test({
            test: (startValue: any) => startValue <= endValue,
            message:
              '시작 일련번호는 마지막 일련번호보다 작거나 같아야 합니다.',
          });
        }),
      workboardEnd: yup
        .number()
        .moreThan(0, '마지막 일련번호는 0보다 커야 합니다.')
        .required('마지막 일련번호를 입력해주세요.')
        .typeError('숫자를 입력해주세요.')
        .integer('정수를 입력해주세요.'),
    })
  );
