import { memo } from 'react';
import { useParams } from 'react-router';
import { Container } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import { fetchBoardDetail } from '~/api/fetches/fetchBoard';
import Breadcrumb from '~/components/shared/Breadcrumb';
import BoardForm from '../../components/BoardForm';

function NoticeModify() {
  const { nid } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['noticeDetail', nid],
    queryFn: () => fetchBoardDetail(nid),
    enabled: !!nid,
  });

  if (isLoading) {
    return null;
  }
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="게시판" breadcrumbItem="공지사항" />
        <BoardForm
          item={data?.response.payload}
          textSubmit="수정"
          formType="notice"
          create={false}
        />
      </Container>
    </div>
  );
}

export default memo(NoticeModify);
