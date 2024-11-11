import { Button } from 'reactstrap';
type Props = {
  handleEdit: (data: any) => void;
  handleDelete: (workboardId: string) => void;
  authority: any;
};

const columns = ({ handleEdit, handleDelete, authority }: Props) => {
  return [
    {
      Header: '매체 분류',
      accessor: 'contentsMediaCategoryName',
      disableSortBy: true,
    },
    { Header: '시작 IDX번호', accessor: 'workboardStart', disableSortBy: true },
    { Header: '마지막 IDX번호', accessor: 'workboardEnd', disableSortBy: true },
    {
      Header: '관리',
      disableSortBy: true,
      Cell: (cellProps: any) => {
        const {
          workboardId,
          workboardStart,
          workboardEnd,
          memberNo,
          contentsMediaCategory,
        } = cellProps.row.original;

        const data = {
          memberNo,
          workboardId,
          workboardStart,
          workboardEnd,
          contentsMediaCategory,
        };

        return (
          <div className="btn-group" role="group">
            {authority.response.payload.menu.menuU && (
              <Button
                color="warning"
                size="sm"
                onClick={() => handleEdit(data)}
              >
                <i className="fas fa-edit me-1" />
                수정
              </Button>
            )}
            {authority.response.payload.menu.menuD && (
              <Button
                color="danger"
                size="sm"
                onClick={() => handleDelete(workboardId)}
              >
                <i className="mdi mdi-delete me-1" />
                삭제
              </Button>
            )}
          </div>
        );
      },
    },
  ];
};
export default columns;
