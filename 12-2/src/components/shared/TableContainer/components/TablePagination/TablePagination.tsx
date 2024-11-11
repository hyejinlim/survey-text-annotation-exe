import { memo, useEffect, useMemo, useState } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

type Props = {
  totalPage: number;
  curPage: number;
  canPreviousPage?: boolean;
  canNextPage?: boolean;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  onPage?: (index: number) => void;
};

const PAGES_PER_LIST = 10;
function TablePagination({
  totalPage,
  curPage: page,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
  onPage,
}: Props) {
  const [curPage, setCurPage] = useState<number>(page + 1);
  const [showPage, setShowPage] = useState({
    start: 1,
    end: PAGES_PER_LIST,
  });

  const handlePageArray = (prev: any, position: number, totalPage: any) => {
    const { start, end } = prev;
    let res;
    if (position === 1) {
      const nextEndIndex = end + PAGES_PER_LIST;
      res = nextEndIndex > totalPage ? totalPage : nextEndIndex;
    } else if (position === -1) {
      res = end - PAGES_PER_LIST;
    }
    const nextStart = start + PAGES_PER_LIST * position;
    const next = { start: nextStart, end: res };
    return { ...prev, ...next };
  };

  const handlePreviousPage = () => {
    if (curPage === showPage.start && curPage > PAGES_PER_LIST) {
      setShowPage((prev) => handlePageArray(prev, -1, totalPage));
    }
    onPreviousPage && onPreviousPage();
  };

  const handleNextPage = () => {
    if (curPage === showPage.end && showPage.end <= totalPage) {
      setShowPage((prev) => handlePageArray(prev, 1, totalPage));
    }
    onNextPage && onNextPage();
  };

  const handlePage = (index: number) => {
    onPage && onPage(index);
  };

  /**
   * useEffect
   */
  useEffect(() => {
    setCurPage(page + 1);
  }, [page]);

  useEffect(() => {
    setShowPage((prev) => {
      const newEnd = Math.min(prev.start + PAGES_PER_LIST - 1, totalPage);
      return {
        ...prev,
        end: newEnd,
      };
    });
  }, [totalPage, curPage]);

  // 보여지는 페이지들
  const SHOW_PAGES = useMemo(
    () =>
      Array.from(
        { length: showPage.end - showPage.start + 1 },
        (_, i) => i + showPage.start
      ),
    [showPage]
  );

  if (totalPage <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationItem disabled={!canPreviousPage}>
        <PaginationLink previous onClick={handlePreviousPage} />
      </PaginationItem>
      {SHOW_PAGES.map((page: number) => {
        return (
          <PaginationItem
            key={page}
            active={curPage === page}
            onClick={handlePage.bind(null, page - 1)}
          >
            <PaginationLink>{page}</PaginationLink>
          </PaginationItem>
        );
      })}
      <PaginationItem disabled={!canNextPage}>
        <PaginationLink next onClick={handleNextPage} />
      </PaginationItem>
    </Pagination>
  );
}

export default memo(TablePagination);
