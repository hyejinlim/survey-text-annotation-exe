import { memo } from 'react';
import { Col, Row } from 'reactstrap';
import InterviewDataModify from '~/components/interview/InterviewDataDetail/InterviewDataModify';
import CollapseBox from '~/components/shared/CollapseBox';
import * as styles from './styles';
import InterviewQuestionInfoModify from '../InterviewQuestionInfoModify';
import InterviewTextAnnotation from '../InterviewTextAnnotation';

function InterviewTextAnnotationTool() {
  return (
    <Row css={styles.container} className="gx-0">
      <Col xs={9} css={styles.wrapper}>
        <InterviewTextAnnotation />
      </Col>
      <Col xs={3} css={styles.rightSide}>
        {/* 인터뷰 정보 */}
        <CollapseBox title="인터뷰 정보" isOpen={false}>
          <InterviewDataModify />
        </CollapseBox>
        {/* 문항별 정보 === 라벨링 form */}
        <InterviewQuestionInfoModify />
      </Col>
    </Row>
  );
}

export default memo(InterviewTextAnnotationTool);
