import { memo } from 'react';
import { Alert } from 'reactstrap';

function Guide() {
  return (
    <Alert color="secondary" className="font-size-16">
      <div>
        <i className="mdi mdi-check-all me-2" />
        생성된 그룹에 회원이 존재하면 삭제가 불가능 합니다.(수정만 가능)
      </div>
      <div>
        <i className="mdi mdi-check-all me-2" />각 그룹의 메뉴권한과 기능권한은
        하단의 [저장] 버튼을 반드시 눌러 변경사항을 저장해 주세요.
      </div>
    </Alert>
  );
}

export default memo(Guide);
