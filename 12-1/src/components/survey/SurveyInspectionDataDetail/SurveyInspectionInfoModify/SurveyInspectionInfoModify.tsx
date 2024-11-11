import { memo, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from 'reactstrap';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import * as R from 'ramda';
import { fetchSurveyDetailDataModify } from '~/api/fetches/fetchSurvey';
import CollapseBox from '~/components/shared/CollapseBox';
import { SurveyTextAnnotationContext } from '~/libs/contexts/SurveyTextAnnotationContext';
import SurveyDataModify from '../../SurveyDataModify';

function SurveyInspectionInfoModify() {
  const { document } = useContext(SurveyTextAnnotationContext);
  const { info, infoChange } = document || {};
  const { surveyId } = info || {};

  const methods = useForm();
  methods.watch();

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

  return (
    <FormProvider {...methods}>
      <CollapseBox title="설문지 정보" isOpen={false}>
        <SurveyDataModify readonly={!infoChange} />
        {infoChange && (
          <div className="d-flex gap-2 justify-content-center py-3">
            <Button color="info" onClick={methods.handleSubmit(handleModify)}>
              수정
            </Button>
          </div>
        )}
      </CollapseBox>
    </FormProvider>
  );
}

export default memo(SurveyInspectionInfoModify);
