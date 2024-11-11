import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Container } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import { fetchNoticeList } from '~/api/fetches/fetchBoard';
import Breadcrumb from '~/components/shared/Breadcrumb';
import CreateButton from '~/components/shared/CreateButton/CreateButton';
import TableContainer from '~/components/shared/TableContainer/TableContainer';
import { MENU0601 } from '~/constants/menu';
import { useCheckAuthorityQuery } from '~/hooks';
import columns from './constant';

function NoticeList() {
  const navigate = useNavigate();

  const { data: noticeList, isLoading: noticeListLoading } = useQuery({
    queryKey: ['noticeList'],
    queryFn: fetchNoticeList,
  });

  const { data: authority, isLoading: authorityLoading } =
    useCheckAuthorityQuery(MENU0601);

  const handleClickDetail = (id: number) => {
    navigate(`/board/notice/${id}`);
  };

  const handleClick = () => {
    navigate('/board/notice/form');
  };

  const isLoading = noticeListLoading || authorityLoading;

  const columnsMemozation = useMemo(
    () => columns(authority, handleClickDetail),
    [authority]
  );

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="게시판" breadcrumbItem="공지사항" />
        <TableContainer
          columns={columnsMemozation}
          createButton={
            authority?.response.payload.menu.menuC && (
              <CreateButton
                title="신규작성"
                color="primary"
                onClick={handleClick}
              />
            )
          }
          isLoading={isLoading}
          data={noticeList?.response.payload || []}
          defaultPageSize={10}
          isCheckbox={false}
          isGlobalFilter
        />
      </Container>
    </div>
  );
}

export default memo(NoticeList);
