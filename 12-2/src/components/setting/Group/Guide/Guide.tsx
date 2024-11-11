import { memo } from 'react';
import { Button } from 'reactstrap';
import GuideAlert from '~/components/shared/GuideAlert';

function Guide() {
  return (
    <GuideAlert color="secondary">
      <div>
        <i className="mdi mdi-check-all me-2" />
        생성된 그룹에 회원이 존재하면 삭제가 불가능 합니다.(수정만 가능)
        <br />
        <i className="mdi mdi-check-all me-2" />
        <Button color="soft-info" size="sm">
          <i className="fas fa-edit" />
        </Button>
        <strong>수정</strong>,&nbsp;
        <Button color="soft-danger" size="sm">
          <i className="fas fa-ban" />
        </Button>
        <strong>미사용</strong>,&nbsp;
        <Button size="sm" className="btn btn-light waves-effect">
          <i className="bx bx-revision" />
        </Button>
        <strong>복구</strong> 버튼입니다.
      </div>
      <div>
        <i className="mdi mdi-check-all me-2" />
        수정 후 엔터를 누르면 수정사항이 반영됩니다.
      </div>
    </GuideAlert>
  );
}

export default memo(Guide);
