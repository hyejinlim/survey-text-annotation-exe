import { memo } from 'react';
import { useParams } from 'react-router';
import { Container } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import { fetchBoardDetail } from '~/api/fetches/fetchBoard';
import Breadcrumb from '~/components/shared/Breadcrumb';
import BoardForm from '../../components/BoardForm';

function QnaDetail() {
  const { iid } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['qnaDetail', iid],
    queryFn: () => fetchBoardDetail(iid),
    enabled: !!iid,
  });

  if (isLoading) return null;

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="게시판" breadcrumbItem="QnA 상세" />
        <BoardForm
          textSubmit="수정"
          formType="qna"
          item={data?.response.payload}
          create={false}
        />
      </Container>
    </div>
  );
}

export default memo(QnaDetail);
