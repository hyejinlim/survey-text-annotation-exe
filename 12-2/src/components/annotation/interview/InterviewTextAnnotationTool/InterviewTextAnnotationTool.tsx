import { memo, useContext, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import { fetchInterviewLabeling } from '~/api/fetches/fetchInterview';
import Loading from '~/components/shared/Loading';
import { InterviewTextAnnotationContext } from '~/libs/contexts/InterviewTextAnnotationContext';
import * as styles from './styles';
import InterviewInfo from '../InterviewInfo';
import InterviewQuestionInfoModify from '../InterviewQuestionInfoModify';
import InterviewTextAnnotation from '../InterviewTextAnnotation';

function InterviewTextAnnotationTool() {
  const { interviewId, setDocument } = useContext(
    InterviewTextAnnotationContext
  );

  // 라벨링 데이터
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['interviewLabeling', interviewId],
    queryFn: () =>
      fetchInterviewLabeling({ interviewId }).then(({ response }) => response),
    enabled: interviewId > 0,
  });

  /** data setState */
  useEffect(() => {
    if (data) {
      const { result, payload, ...rest } = data;
      if (result === 'success') setDocument({ labelingList: payload, ...rest });
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center h-100 align-items-center">
        <Loading />
      </div>
    );
  }
  return (
    <Row css={styles.container} className="gx-0">
      <Col xs={9} css={styles.wrapper}>
        <InterviewTextAnnotation />
      </Col>
      <Col xs={3} css={styles.rightSide}>
        {/* 인터뷰 정보 */}
        <InterviewInfo />
        {/* 문항별 정보 === 라벨링 form */}
        <InterviewQuestionInfoModify labelingRefetch={refetch} />
      </Col>
    </Row>
  );
}

export default memo(InterviewTextAnnotationTool);
