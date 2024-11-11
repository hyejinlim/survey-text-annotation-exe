import {
  Fragment,
  ReactNode,
  memo,
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
  useRowSelect,
} from 'react-table';
import { Input, Table, Button, Row, Col } from 'reactstrap';
import TableGlobalFilter from './components/TableGlobalFilter';
import TablePagination from './components/TablePagination';
import TableToolbar from './components/TableToolbar';
import * as styles from './styles';

type Props = {
  columns: any;
  data: any;
  defaultPageSize?: any;
  ListLeftArea?: ReactNode;
  selectButtons?: ReactNode;
  createButton?: ReactNode;
  isSelectedButtons?: boolean;
  isGlobalFilter?: boolean;
  isListLeftArea?: boolean;
  isListOptionVisible?: boolean;
  isPaginationOpen?: boolean;
  isCheckbox?: boolean;
  onDeleteSelectedValues?: any;
  onCopy?: any;
  codeDetailCreateButton?: any;
  onCellClick?: (cell: string) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  isSketchButtons?: any;
  isDeleteButton?: any;
  editeButton?: ReactNode;
  isLoading?: any;
  onHandleHeader?: any;
  queryStringState?: any;
  onSearchKeyword?: any;
  totalPage?: any;
};

const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, ...rest }: any, ref) => {
    const resolvedRef = useRef<any>();
    useImperativeHandle(ref, () => resolvedRef.current);
    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <Input
        type="checkbox"
        ref={resolvedRef}
        {...rest}
        className="font-size-20"
        css={styles.checkbox}
      />
    );
  }
);

function TableContainer({
  columns,
  data,
  defaultPageSize,
  ListLeftArea,
  isSelectedButtons,
  isGlobalFilter,
  isListLeftArea,
  isPaginationOpen = true,
  isListOptionVisible,
  isCheckbox = true,
  onCellClick,
  onPageChange,
  onPageSizeChange,
  createButton,
  editeButton,
  onDeleteSelectedValues,
  onCopy,
  isSketchButtons,
  isDeleteButton,
  isLoading,
  onHandleHeader,
  queryStringState,
  onSearchKeyword,
}: Props) {
  /**선택한 컬럼만 숨기는 함수   */
  const hiddenColumns = useMemo(() => {
    return columns
      .filter((column: any) => column.defaultHidden)
      .map((column: any) => column.accessor);
  }, [columns]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page: pageData,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    allColumns,
    selectedFlatRows,
    toggleAllRowsSelected,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: defaultPageSize ? defaultPageSize : 10,
        hiddenColumns,
      },
      disableSortBy: false,
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,

    (hooks: any) => {
      if (!isCheckbox) return null;
      hooks.visibleColumns.push((columns: any) => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }: any) => {
            return (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            );
          },
          Cell: ({ row }: any) => {
            return (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            );
          },
        },
        ...columns,
      ]);
    }
  );

  const selectedIdsArray = selectedFlatRows.map((row: any) => row.original.id);

  const generateSortingIndicator = (column: any) => {
    if (column.disableSortBy) {
      return '';
    }
    return column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : '';
  };

  const handlePageSize = (e: any) => {
    const { value } = e.target;
    gotoPage(0);
    setPageSize(+value);
    onPageSizeChange && onPageSizeChange(+value);
  };

  const handlePage = (index: number) => {
    gotoPage(index);
    onPageChange && onPageChange(index + 1);
  };

  const handleFilterItem = (id: string) => {
    allColumns.forEach((column: any) => {
      if (column.id === id) column.toggleHidden();
    });
  };

  const handlePreviousPage = () => previousPage();
  const handleNextPage = () => nextPage();
  const handleCellClick = (cell: any) => {
    onCellClick && onCellClick(cell);
  };
  //  컬럼 클릭하는 함수
  const handleHeader = (column: any) => {
    onHandleHeader && onHandleHeader(column);
  };

  return (
    <Fragment>
      <Row className="d-flex mb-3">
        {isListLeftArea && <Col lg="5">{ListLeftArea}</Col>}
        <Col
          lg={isListLeftArea ? '7' : '12'}
          className="d-flex gap-2 justify-content-end"
        >
          {isPaginationOpen && (
            <div>
              <select
                className="form-select"
                value={pageSize}
                onChange={handlePageSize}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => {
                  return (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          {isGlobalFilter && (
            <TableGlobalFilter
              rows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
              queryStringState={queryStringState}
              onSearchKeyword={onSearchKeyword}
            />
          )}
          {isListOptionVisible && (
            <div className="d-flex gap-2">
              <TableToolbar
                columns={allColumns}
                onFilterItem={handleFilterItem}
              />
            </div>
          )}
          {createButton}
          {editeButton}
        </Col>
      </Row>

      <div className="table-responsive">
        <Table bordered hover {...getTableProps()}>
          <thead className="table-light table-nowrap shadow-sm">
            {headerGroups.map((headerGroup: any) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any) => (
                  <th
                    key={column.id}
                    style={{ minWidth: column.minWidth, width: column.width }}
                    onClick={() => handleHeader(column)}
                    className="flex justify-content-between"
                    css={styles.table}
                  >
                    <div
                      className="text-center"
                      {...column.getSortByToggleProps()}
                    >
                      {column.render('Header')}
                      <span>{generateSortingIndicator(column)}</span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {isLoading ? ( // 로딩 중인 경우
              <tr>
                <td colSpan={columns.length} className="text-center">
                  <div
                    className="spinner-border spinner-border-sm "
                    role="status"
                  />
                  <h4>로딩 중입니다...</h4>
                </td>
              </tr>
            ) : pageData.length > 0 ? ( // 데이터가 비어있지 않은 경우
              pageData.map((row: any) => {
                prepareRow(row);
                return (
                  <Fragment key={row.getRowProps().key}>
                    <tr>
                      {row.cells.map((cell: any) => {
                        const { id } = cell;
                        return (
                          <td
                            key={id}
                            {...cell.getCellProps()}
                            className="text-center align-middle"
                            onClick={handleCellClick.bind(null, cell)}
                          >
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  </Fragment>
                );
              })
            ) : (
              // 데이터가 비어있는 경우
              <tr>
                <td colSpan={columns.length} className="text-center">
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <div
        className={`${
          isSelectedButtons
            ? 'd-flex justify-content-between'
            : 'd-flex justify-content-end'
        }`}
      >
        <div className="d-flex gap-2 justify-content-center align-itme-center py-2">
          {isSelectedButtons && (
            <>
              <Button color="secondary" onClick={() => toggleAllRowsSelected()}>
                <i className="bx bx-select-multiple me-1" />
                전체선택
              </Button>
              {!isSketchButtons && (
                <Button
                  color="success"
                  onClick={() => onCopy(selectedIdsArray)}
                >
                  <i className="bx bx-copy me-1" />
                  선택복제
                </Button>
              )}
            </>
          )}
          {isDeleteButton && (
            <Button
              color="danger"
              onClick={() => onDeleteSelectedValues(selectedIdsArray)}
            >
              <i className="mdi mdi-delete me-1"></i>
              선택삭제
            </Button>
          )}
        </div>

        {isPaginationOpen && (
          <TablePagination
            totalPage={pageCount}
            curPage={pageIndex}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            onPage={handlePage}
          />
        )}
      </div>
    </Fragment>
  );
}

export default memo(TableContainer);
