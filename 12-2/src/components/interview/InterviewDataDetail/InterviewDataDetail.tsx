import { memo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Col, Label, Row } from 'reactstrap';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import {
  fetchInterviewDetailDataModify,
  fetchInterviewRequestInspection,
  fetchInterviewStatusModify,
} from '~/api/fetches/fetchInterview';
import CollapseBox from '~/components/shared/CollapseBox';
import Loading from '~/components/shared/Loading';
import TextArea from '~/components/shared/TextArea';
import { useInterviewDetailDataQuery } from '~/hooks';
import InterviewDataModify from './InterviewDataModify';
import * as styles from './styles';

function InterviewDataDetail() {
  const { interviewId } = useParams();
  const [data, setData] = useState<any>([]); // 인터뷰 대상자

  const methods = useForm();
  methods.watch();

  const { data: interviewData, isLoading: dataLoading } =
    useInterviewDetailDataQuery(interviewId!);

  const handleMutationSuccess = (data: any) => {
    const { result, message } = data.response.payload;
    if (result === 'error') {
      Swal.fire({
        icon: 'error',
        title: `${message ?? 'API 오류'}`,
        confirmButtonText: '확인',
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: '수정이 완료되었습니다.',
        confirmButtonText: '확인',
      });
    }
  };

  const mutation = useMutation(fetchInterviewDetailDataModify, {
    onSuccess: handleMutationSuccess,
  });

  const updateStatusMutation = useMutation(fetchInterviewStatusModify, {
    onSuccess: handleMutationSuccess,
  });

  const inspectionRequestMutation = useMutation(
    fetchInterviewRequestInspection,
    { onSuccess: handleMutationSuccess }
  );

  const handleChange = ({ name, value }: any) => {
    methods.setValue(name, value, { shouldValidate: true });
  };

  const handleFail = () => {
    const params = {
      interviewId,
      interviewStatus: 'F',
      interviewStatusText: methods.getValues('interviewStatusText'),
    };
    updateStatusMutation.mutateAsync(params);
  };

  const handleRequest = () => {
    const params = { interviewId };
    inspectionRequestMutation.mutateAsync(params);
  };

  const handleModify = (values: any) => {
    const {
      interviewTopicView,
      interviewTopicDetailView,
      interviewKeywordArray,
      interviewSourceView,
      interviewStyleView,
      interviewTypeView,
      interviewPurpose,
      interviewTitle,
    } = values;

    const params = {
      interviewId,
      interviewPurpose,
      interviewTitle,
      interviewTopic: interviewTopicView?.value,
      interviewTopicDetail: interviewTopicDetailView?.value,
      interviewSource: interviewSourceView?.value,
      interviewStyle: interviewStyleView?.value,
      interviewType: interviewTypeView?.value,
      interviewKeywordParam: interviewKeywordArray,
      intervieweeList: data,
    };

    mutation.mutateAsync(params);
  };

  if (dataLoading) return <Loading />;

  return (
    <Card>
      <Row className="gx-0">
        <Col md="5" lg="7">
          <div css={styles.textarea}>
            <div
              dangerouslySetInnerHTML={{
                __html: interviewData?.info?.interviewText,
              }}
            />
          </div>
        </Col>
        <Col css={styles.wrapper}>
          <FormProvider {...methods}>
            <CollapseBox title="인터뷰 정보" isOpen={true}>
              <InterviewDataModify data={data} setData={setData} />
            </CollapseBox>
          </FormProvider>
          <div className="d-flex gap-2 justify-content-center py-3">
            <Link to={`/interview/labeling/${interviewId}`} target="_blank">
              <Button color="info">가공</Button>
            </Link>
            <Button onClick={methods.handleSubmit(handleModify)}>수정</Button>
            <Button onClick={handleRequest} color="success">
              상위검수요청
            </Button>
            <Button color="danger" onClick={handleFail}>
              탈락
            </Button>
          </div>
          <div className="px-3 py-2">
            <Label className="form-label">탈락사유</Label>
            <TextArea
              name="interviewStatusText"
              placeholder="탈락사유를 작성해주세요."
              value={methods.getValues('interviewStatusText') ?? ''}
              rows={5}
              onChange={handleChange}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
}

export default memo(InterviewDataDetail);
