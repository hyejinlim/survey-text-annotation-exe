import { memo } from 'react';
import { Col, Row } from 'reactstrap';
import CollapseBox from '~/components/shared/CollapseBox';
import SurveyDataModify from '~/components/survey/SurveyDataModify';
import * as styles from './styles';
// import SurveyQuestionInfoModify from '../SurveyQuestionInfoModify';
import SurveyTextAnnotation from '../SurveyTextAnnotation';

function SurveyTextAnnotationTool() {
  return (
    <Row css={styles.container} className="gx-0">
      <Col xs={9} css={styles.wrapper}>
        <SurveyTextAnnotation />
      </Col>
      <Col xs={3} css={styles.rightSide}>
        {/* 설문지 정보 */}
        <CollapseBox title="설문지 정보" isOpen={false}>
          <SurveyDataModify />
        </CollapseBox>
        {/* 문항별 정보 === 라벨링 form */}
        {/* <SurveyQuestionInfoModify /> */}
      </Col>
    </Row>
  );
}

export default memo(SurveyTextAnnotationTool);
