import { Link } from 'react-router-dom';

const columns = (handleEdit: (codeListId: string) => void, authority: any) => [
  { Header: '분류ID', accessor: 'codeListId', disableSortBy: true },
  { Header: '분류이름', accessor: 'codeListName', disableSortBy: true },
  {
    Header: '코드분류 설명',
    accessor: 'codeListDescript',
    disableSortBy: true,
  },
  {
    Header: '상세코드',
    accessor: 'detail',
    Cell: (cellProps: any) => {
      const { codeListId } = cellProps.row.original;
      if (!authority.response.payload.menu.menuR) return null;
      return (
        <div className="btn-group" role="group">
          <Link
            to={`/setting/code/${codeListId}`}
            className="btn btn-success btn-sm"
          >
            <i className="mdi mdi-eye me-1" />
            목록보기
          </Link>
        </div>
      );
    },
  },
  {
    Header: '등록일시',
    accessor: 'createDatetime',
    disableSortBy: true,
  },
  {
    Header: '관리',
    Cell: (cellProps: any) => {
      const { codeListId } = cellProps.row.original;
      if (!authority.response.payload.menu.menuU) return null;
      return (
        <div className="btn-group" role="group">
          <button
            className="btn btn-warning btn-sm"
            onClick={() => handleEdit(codeListId)}
          >
            <i className="fas fa-edit" />
            수정
          </button>
        </div>
      );
    },
  },
];

export { columns };
