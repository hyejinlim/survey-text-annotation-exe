import { Badge, Button } from 'reactstrap';
import * as styles from './styles';
import { MEMBER_STATE } from '../MemberForm/constants';

const columns = (authority: any, handleDetail: (memberNo: number) => void) => {
  return [
    { Header: '소속', accessor: 'group1' },
    { Header: '그룹', accessor: 'group2' },
    { Header: '역할', accessor: 'group3' },
    { Header: '이름', accessor: 'name' },
    { Header: '최근접속일', accessor: 'datetime' },
    { Header: '등록일시', accessor: 'created', disableSortBy: true },
    {
      Header: '상태',
      accessor: 'state',
      disableSortBy: true,
      Cell: (cellProps: any) => {
        const { status } = cellProps.row.original;
        const statusObject = MEMBER_STATE.find(
          (item) => +item.value === status
        );
        return (
          <div className="d-flex align-items-center justify-content-center">
            <Badge
              css={styles.bage}
              color=""
              className={`badge-soft-${statusObject?.color}`}
            >
              {statusObject?.label}
            </Badge>
          </div>
        );
      },
    },
    {
      Header: '관리',
      disableSortBy: true,
      Cell: (cellProps: any) => {
        const { memberNo } = cellProps.row.original;

        if (!authority.response.payload.menu.menuR) return null;
        return (
          <div className="btn-group" role="group">
            <Button
              color="success"
              size="sm"
              onClick={() => handleDetail(memberNo)}
            >
              <i className="mdi mdi-eye me-1" />
              보기
            </Button>
          </div>
        );
      },
    },
  ];
};

export { columns };
