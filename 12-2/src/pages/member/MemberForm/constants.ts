// form 초기값
export const InitialValue = {
  // 아이디
  id: '',
  // 비밀번호
  password: '',
  // 이름
  name: '',
  // 상태
  state: '',
  // 그룹
  groupCode: '',
  // 알림 받기
  isAlarm: false,
  // 관리자 메모
  memo: '',
};

export const MEMBER_STATE = [
  { label: '승인대기', value: '1', color: 'secondary' },
  { label: '승인거부', value: '2', color: 'warning' },
  { label: '승인완료', value: '5', color: 'success' },
  { label: '탈퇴', value: '99', color: 'danger' },
];

export type MemberFormType = typeof InitialValue;
