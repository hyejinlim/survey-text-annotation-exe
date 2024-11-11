import { memo, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Col, Row } from 'reactstrap';
import { transInspectionType } from '~/components/interview/functions';
import InspectionLog from '~/components/shared/InspectionLog';
import Loading from '~/components/shared/Loading';
import { useSurveyInspectionDetailDataQuery } from '~/hooks';
import { SurveyTextAnnotationContext } from '~/libs/contexts/SurveyTextAnnotationContext';
import * as styles from './styles';
import SurveyInspectionAccCheck from './SurveyInspectionAccCheck';
import SurveyInspectionCheckModify from './SurveyInspectionCheckModify';
import SurveyInspectionInfoModify from './SurveyInspectionInfoModify';
import SurveyInspectionQuestionModify from './SurveyInspectionQuestionModify';

function SurveyInspectionDataDetail() {
  const { inspectionId, labelingId } = useParams();
  const { document, setDocument, setSelectedText } = useContext(
    SurveyTextAnnotationContext
  );
  const [inspectionCheck, setInspectionCheck] = useState<any>([]);

  const { labelChange, inslog } = document || {};

  const inspectionType = transInspectionType(inspectionId);

  const {
    data: inspectionData,
    isLoading: dataLoading,
    refetch,
  } = useSurveyInspectionDetailDataQuery({
    type: inspectionType,
    labelingId,
  });

  const handleMouseUp = (e: any) => {
    if (e.type === 'mouseup') {
      setSelectedText(window.getSelection()!.toString().replace(/\n/g, ''));
    }
  };

  /** data setState */
  useEffect(() => {
    if (inspectionData) {
      const { result, ...rest } = inspectionData;
      if (result === 'success') setDocument(rest);
    }
  }, [inspectionData]);

  if (dataLoading) return <Loading />;

  return (
    <Card>
      <Row className="gx-0">
        <Col md="5" lg="7">
          <div css={styles.textarea}>
            <div
              onMouseUp={labelChange ? (e) => handleMouseUp(e) : undefined}
              dangerouslySetInnerHTML={{
                __html: inspectionData?.info?.surveyText,
              }}
            />
          </div>
        </Col>
        <Col css={styles.wrapper}>
          <SurveyInspectionInfoModify />
          <SurveyInspectionQuestionModify dataRefetch={refetch} />
          {inspectionId === 'final' && (
            <SurveyInspectionAccCheck
              inspectionCheck={inspectionCheck}
              setInspectionCheck={setInspectionCheck}
            />
          )}
          <SurveyInspectionCheckModify
            type={inspectionType}
            inspectionCheck={inspectionCheck}
          />
          <InspectionLog data={inslog} />
        </Col>
      </Row>
    </Card>
  );
}

export default memo(SurveyInspectionDataDetail);
