import { memo, useContext, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import { fetchSurveyLabeling } from '~/api/fetches/fetchSurvey';
import Loading from '~/components/shared/Loading';
import { SurveyTextAnnotationContext } from '~/libs/contexts/SurveyTextAnnotationContext';
import * as styles from './styles';
import SurveyInfo from '../SurveyInfo';
import SurveyQuestionInfoModify from '../SurveyQuestionInfoModify';
import SurveyTextAnnotation from '../SurveyTextAnnotation';

function SurveyTextAnnotationTool() {
  const { surveyId, setDocument } = useContext(SurveyTextAnnotationContext);

  // 서베이 라벨링 데이터
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['surveyLabeling', surveyId],
    queryFn: () =>
      fetchSurveyLabeling({ surveyId }).then(({ response }) => response),
    enabled: surveyId > 0,
  });

  /** data setState */
  useEffect(() => {
    if (data) {
      const { result, payload, ...rest } = data;
      console.log({ labelingList: payload, ...rest });

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
        <SurveyTextAnnotation />
      </Col>
      <Col xs={3} css={styles.rightSide}>
        {/* 설문지 정보 */}
        <SurveyInfo />
        {/* 문항별 정보 === 라벨링 form */}
        <SurveyQuestionInfoModify labelingRefetch={refetch} />
      </Col>
    </Row>
  );
}

export default memo(SurveyTextAnnotationTool);
