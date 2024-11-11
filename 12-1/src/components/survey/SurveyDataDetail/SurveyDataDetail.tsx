import { memo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Col, Label, Row } from 'reactstrap';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import * as R from 'ramda';
import {
  fetchSurveyDetailDataModify,
  fetchSurveyStatusModify,
} from '~/api/fetches/fetchSurvey';
import CollapseBox from '~/components/shared/CollapseBox';
import Loading from '~/components/shared/Loading';
import TextArea from '~/components/shared/TextArea';
import { useSurveyDetailDataQuery } from '~/hooks';
import * as styles from './styles';
import SurveyDataModify from '../SurveyDataModify';

function SurveyDataDetail() {
  const { surveyId } = useParams();

  const methods = useForm();
  methods.watch();

  const { data: surveyData, isLoading: dataLoading } = useSurveyDetailDataQuery(
    surveyId!
  );

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

  const mutation = useMutation(fetchSurveyDetailDataModify, {
    onSuccess: handleMutationSuccess,
  });

  const updateStatusMutation = useMutation(fetchSurveyStatusModify, {
    onSuccess: handleMutationSuccess,
  });

  const handleChange = ({ name, value }: any) => {
    methods.setValue(name, value, { shouldValidate: true });
  };

  const handleFail = () => {
    const params = {
      surveyId,
      surveyStatus: 'F',
      surveyStatusText: methods.getValues('surveyStatusText'),
    };
    updateStatusMutation.mutateAsync(params);
  };

  const handleRequest = () => {
    const params = {
      surveyId,
      surveyStatus: 'T',
      surveyStatusText: '',
    };
    updateStatusMutation.mutateAsync(params);
  };

  const handleModify = (values: any) => {
    const {
      surveyAgeView,
      surveyMethodView,
      surveyIndustryView,
      surveyTopicView,
      surveyTopicDetailView,
      surveyGenderView,
      surveyKeywordArray,
      ...rest
    } = values;

    const surveyAge = R.map(({ value }) => value, surveyAgeView);

    const params = {
      surveyId,
      surveyMethod: surveyMethodView?.value,
      surveyIndustry: surveyIndustryView?.value,
      surveyTopic: surveyTopicView?.value,
      surveyTopicDetail: surveyTopicDetailView?.value,
      surveyGender: surveyGenderView?.value,
      surveyAgeParam: surveyAge ?? [],
      surveyKeywordParam: surveyKeywordArray,
      ...rest,
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
                __html: surveyData?.info?.surveyText,
              }}
            />
          </div>
        </Col>
        <Col css={styles.wrapper}>
          <FormProvider {...methods}>
            <CollapseBox title="설문지 정보" isOpen={true}>
              <SurveyDataModify />
            </CollapseBox>
          </FormProvider>
          <div className="d-flex gap-2 justify-content-center py-3">
            <Link to={`/survey/labeling/${surveyId}`} target="_blank">
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
              name="surveyStatusText"
              placeholder="탈락사유를 작성해주세요."
              value={methods.getValues('surveyStatusText') ?? ''}
              rows={5}
              onChange={handleChange}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
}

export default memo(SurveyDataDetail);
