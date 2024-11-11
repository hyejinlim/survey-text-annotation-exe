import { Button } from 'reactstrap';

const columns = (authority: any, handleClickDetail: (id: number) => void) => {
  return [
    {
      Header: '제목',
      accessor: 'title',
      disableSortBy: true,
      minWidth: 300,
      width: 300,
    },
    {
      Header: '작성자',
      accessor: 'writer',
      disableSortBy: true,
      minWidth: 70,
      width: 70,
    },
    {
      Header: '등록일시',
      accessor: 'createdate',
      disableSortBy: true,
      minWidth: 70,
      width: 70,
    },
    {
      Header: '비고',
      accessor: 'detail',
      disableSortBy: true,
      minWidth: 70,
      width: 70,
      Cell: (cellProps: any) => {
        const { id } = cellProps.row.original;

        if (!authority.response.payload.menu.menuR) return null;
        return (
          <Button
            size="sm"
            color="success"
            onClick={() => handleClickDetail(id)}
          >
            <i className="mdi mdi-eye me-1" />
            상세보기
          </Button>
        );
      },
    },
  ];
};

export default columns;
