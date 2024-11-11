import { memo, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Col, Row } from 'reactstrap';
import InspectionLog from '~/components/shared/InspectionLog';
import Loading from '~/components/shared/Loading';
import { useInterviewInspectionDetailDataQuery } from '~/hooks';
import { InterviewTextAnnotationContext } from '~/libs/contexts/InterviewTextAnnotationContext';
import InterviewInspectionAccCheck from './InterviewInspectionAccCheck';
import InterviewInspectionCheckModify from './InterviewInspectionCheckModify';
import InterviewInspectionEachAccCheck from './InterviewInspectionEachAccCheck';
import InterviewInspectionInfoModify from './InterviewInspectionInfoModify';
import InterviewInspectionQuestionModify from './InterviewInspectionQuestionModify';
import * as styles from './styles';
import { transInspectionType } from '../functions';

function InterviewInspectionDataDetail() {
  const { interviewId, inspectionId } = useParams();
  const { document, setDocument, setSelectedText, setLabelCheckList } =
    useContext(InterviewTextAnnotationContext);
  const [inspectionCheck, setInspectionCheck] = useState<any>([]);

  const { labelChange, inslog } = document || {};

  const inspectionType = transInspectionType(inspectionId);

  const {
    data: inspectionData,
    isLoading: dataLoading,
    refetch,
  } = useInterviewInspectionDetailDataQuery({
    type: inspectionType,
    interviewId,
  });

  const handleMouseUp = (e: any) => {
    if (e.type === 'mouseup') {
      setSelectedText(window.getSelection()!.toString().replace(/\n/g, ''));
    }
  };

  /** data setState */
  useEffect(() => {
    if (inspectionData) {
      const { result, payload, labelchecklist, ...rest } = inspectionData;
      if (result === 'success') {
        setDocument({ ...rest, labelingList: payload });
        setLabelCheckList(labelchecklist);
      }
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
                __html: inspectionData?.info?.interviewText,
              }}
            />
          </div>
        </Col>
        <Col css={styles.wrapper}>
          <InterviewInspectionInfoModify />
          <InterviewInspectionQuestionModify
            type={inspectionType}
            dataRefetch={refetch}
          />
          {inspectionId === 'final' && (
            <>
              <InterviewInspectionEachAccCheck />
              <InterviewInspectionAccCheck
                inspectionCheck={inspectionCheck}
                setInspectionCheck={setInspectionCheck}
              />
            </>
          )}
          <InterviewInspectionCheckModify
            type={inspectionType}
            inspectionCheck={inspectionCheck}
          />
          <InspectionLog data={inslog} />
        </Col>
      </Row>
    </Card>
  );
}

export default memo(InterviewInspectionDataDetail);
