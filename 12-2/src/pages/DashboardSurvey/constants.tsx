import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';

const columns = [
  { Header: '소속', accessor: 'group1' },
  { Header: '그룹', accessor: 'group2' },
  { Header: '역할', accessor: 'group3' },
  { Header: '이름', accessor: 'name' },
  {
    Header: '상태',
    accessor: 'state',
    disableSortBy: true,
    Cell: () => {
      return (
        <div className="d-flex align-items-center justify-content-center">
          <Badge color="" className="badge-soft-secondary">
            승인대기
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
      return (
        <div className="btn-group" role="group">
          <Link
            to={`/member/${memberNo}/detail`}
            className="btn btn-success btn-sm"
          >
            <i className="mdi mdi-eye me-1" />
            보기
          </Link>
        </div>
      );
    },
  },
];

export { columns };
