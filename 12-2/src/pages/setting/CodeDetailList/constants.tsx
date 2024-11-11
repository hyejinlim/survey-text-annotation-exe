const getColumns = (
  handleEdit: (codeDetailId: string) => void,
  handleSwitch: (data: any) => void,
  codeId: string | undefined
) => [
  { Header: '분류ID', accessor: 'codeDetailId', disableSortBy: true },
  { Header: '분류이름', accessor: 'codeDetailName', disableSortBy: true },
  {
    Header: '코드분류 설명',
    accessor: 'codeDetailDescript',
    disableSortBy: true,
  },
  {
    Header: '사용여부',
    accessor: 'codeDetailOpenTF',
    Cell: (cellProps: any) => {
      const { codeDetailId } = cellProps.row.original;
      const { codeDetailOpenTF } = cellProps.row.original;
      const data = {
        codeDetailId,
        codeDetailOpenTF: !codeDetailOpenTF,
        codeListId: codeId,
      };
      return (
        <div className="d-flex align-items-center justify-content-center">
          <div className="form-check form-switch form-switch-md">
            <input
              readOnly
              type="checkbox"
              className="form-check-input"
              id="customSwitchsizesm"
              checked={cellProps.row.original.codeDetailOpenTF}
              onClick={() => handleSwitch(data)}
            />
          </div>
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
      const { codeDetailId } = cellProps.row.original;
      return (
        <div className="btn-group" role="group">
          <button
            className="btn btn-warning btn-sm"
            onClick={() => handleEdit(codeDetailId)}
          >
            <i className="mdi mdi-eye me-1" />
            수정
          </button>
        </div>
      );
    },
  },
];

export { getColumns };
