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
import TableGlobalFilter from './components/TableGlobalFilter/TableGlobalFilter';
import TablePagination from './components/TablePagination/TablePagination';
import TableToolbar from './components/TableToolbar/TableToolbar';
import * as styles from './styles';

const searchParams = new URLSearchParams(window.location.search);
const sortColumn = searchParams.get('sortColumn') || ''; // 기본 정렬 열
const sortDesc = searchParams.get('sortDesc') === 'true' || false; // 기본 정렬 방향

type Props = {
  columns: any;
  data: any;
  defaultPageSize?: any;
  listLeftArea?: ReactNode;
  selectButtons?: ReactNode;
  createButton?: ReactNode;
  isSelectedButtons?: boolean;
  isGlobalFilter?: boolean;
  isListLeftArea?: boolean;
  isListOptionVisible?: boolean;
  isPaginationOpen?: boolean;
  isCheckbox?: boolean;
  curPage?: number;
  onDeleteSelectedValues?: (values: any) => void;
  onLabelingDelete?: any;
  codeDetailCreateButton?: any;
  onCellClick?: (cell: string) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  isLabelingButtons?: boolean;
  isDeleteButton?: any;
  editeButton?: ReactNode;
  isLoading?: any;
  queryStringState?: any;
  searchKeyword?: any;
  onSearchKeyword?: any;
  totalPage?: any;
  totalRow?: any;
  download?: React.ReactNode | null;
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

function TableApiPaginationContainer({
  columns,
  data,
  defaultPageSize,
  listLeftArea,
  isSelectedButtons,
  isGlobalFilter,
  isListLeftArea,
  isPaginationOpen = true,
  isListOptionVisible,
  isCheckbox = true,
  searchKeyword,
  curPage,
  onCellClick,
  onPageChange,
  onPageSizeChange,
  createButton,
  editeButton,
  onDeleteSelectedValues,
  onLabelingDelete,
  isLabelingButtons,
  isDeleteButton,
  isLoading,
  queryStringState,
  onSearchKeyword,
  totalPage,
  totalRow,
  download,
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
    gotoPage,
    setPageSize,
    state,
    allColumns,
    selectedFlatRows,
    toggleAllRowsSelected,
    state: { pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: defaultPageSize ? defaultPageSize : 10,
        hiddenColumns,
        sortBy: sortColumn ? [{ id: sortColumn, desc: sortDesc }] : [],
        globalFilter: searchKeyword ? searchKeyword : '',
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
          width: 70,
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

  const generateSortingIndicator = (column: any) => {
    if (column.disableSortBy) return '';
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

  const handlePreviousPage = (index: any) => {
    gotoPage(index);
    onPageChange && onPageChange(index - 1);
  };
  const handleNextPage = (index: any) => {
    gotoPage(index);
    onPageChange && onPageChange(index + 1);
  };
  const handleCellClick = (cell: any) => {
    onCellClick && onCellClick(cell);
  };

  return (
    <Fragment>
      <Row className="d-flex mb-3">
        {isListLeftArea && <Col lg="4">{listLeftArea}</Col>}
        <Col
          lg={isListLeftArea ? '8' : '12'}
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
              rows={totalRow}
              globalFilter={state.globalFilter}
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
          {download && (
            <div className="d-flex justify-content-end">{download}</div>
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
                  ></div>
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
                <td
                  colSpan={columns.length + isCheckbox}
                  className="text-center"
                >
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      {/* TODO: 개선 필요 */}
      <div
        className={`${
          isSelectedButtons || isLabelingButtons
            ? 'd-flex justify-content-between'
            : 'd-flex justify-content-end'
        }`}
      >
        <div className="d-flex gap-2 justify-content-center align-itme-center py-2">
          {isSelectedButtons && (
            <Button color="secondary" onClick={toggleAllRowsSelected}>
              <i className="bx bx-select-multiple me-1" />
              전체선택
            </Button>
          )}
          {isDeleteButton && (
            <Button
              color="danger"
              onClick={() => onDeleteSelectedValues?.(selectedFlatRows)}
            >
              <i className="mdi mdi-delete me-1" />
              선택삭제
            </Button>
          )}

          {isLabelingButtons && (
            <>
              <Button color="secondary" onClick={toggleAllRowsSelected}>
                <i className="bx bx-select-multiple me-1" />
                전체선택
              </Button>
              <Button
                color="danger"
                onClick={() => onLabelingDelete(selectedFlatRows)}
              >
                <i className="mdi mdi-delete me-1"></i>
                라벨링 선택 초기화
              </Button>
            </>
          )}
        </div>

        {isPaginationOpen && (
          <TablePagination
            totalPage={totalPage}
            curPage={curPage ? curPage - 1 : 0}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            onPage={handlePage}
          />
        )}
      </div>
    </Fragment>
  );
}

export default memo(TableApiPaginationContainer);
