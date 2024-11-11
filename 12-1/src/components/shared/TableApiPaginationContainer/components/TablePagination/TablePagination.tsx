import { memo, useEffect, useMemo, useState } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

type Props = {
  totalPage: number;
  curPage: number;

  onPreviousPage?: (index: any) => void;
  onNextPage?: (index: any) => void;
  onPage?: (index: number) => void;
};

const PAGES_PER_LIST = 10;
function TablePagination({
  totalPage,
  curPage: page,
  onPreviousPage,
  onNextPage,
  onPage,
}: Props) {
  const [curPage, setCurPage] = useState<number>(page + 1);
  const [showPage, setShowPage] = useState({
    start: Math.floor(page / 10) * 10 + 1,
    end: Math.min(Math.floor((page + 1) / 10) * 10 + 10, totalPage),
  });

  const handlePageArray = (prev: any, position: number, totalPage: any) => {
    const { start, end } = prev;
    let res;
    if (position === 1) {
      const nextEndIndex = end + PAGES_PER_LIST;
      res = nextEndIndex > totalPage ? totalPage : nextEndIndex;

      prev = { start: 1, end: PAGES_PER_LIST };
    } else if (position === -1) {
      const nextStartIndex = start - PAGES_PER_LIST;
      res = nextStartIndex < 1 ? 1 : nextStartIndex;

      prev = { start: 1, end: PAGES_PER_LIST };
    }
    const nextStart = start + PAGES_PER_LIST * position;
    const next = { start: nextStart, end: res };
    return { ...prev, ...next };
  };

  useEffect(() => {
    setShowPage(() => {
      const newStart = Math.floor(page / 10) * 10 + 1;
      const newEnd = Math.min(newStart + 9, totalPage);

      return {
        start: newStart,
        end: newEnd,
      };
    });
  }, [totalPage, curPage]);

  const handlePreviousPage = () => {
    if (curPage === showPage.start && curPage > PAGES_PER_LIST) {
      setShowPage((prev) => handlePageArray(prev, -1, totalPage));
      onPreviousPage && onPreviousPage(curPage);
    } else {
      onPreviousPage && onPreviousPage(curPage);
    }
  };

  const handleNextPage = () => {
    if (curPage === showPage.end && showPage.end <= totalPage) {
      setShowPage((prev) => handlePageArray(prev, 1, totalPage));
      onNextPage && onNextPage(curPage);
    } else {
      onNextPage && onNextPage(curPage);
    }
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
    if (curPage === 1) {
      setShowPage(() => {
        return {
          start: 1,
          end: Math.min(PAGES_PER_LIST, totalPage),
        };
      });
    }
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
      <PaginationItem disabled={curPage === 1}>
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
      <PaginationItem disabled={curPage >= totalPage}>
        <PaginationLink next onClick={handleNextPage} />
      </PaginationItem>
    </Pagination>
  );
}

export default memo(TablePagination);
