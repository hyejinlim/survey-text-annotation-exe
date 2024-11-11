import { memo, useContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from 'reactstrap';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { fetchInterviewDetailDataModify } from '~/api/fetches/fetchInterview';
import CollapseBox from '~/components/shared/CollapseBox';
import { InterviewTextAnnotationContext } from '~/libs/contexts/InterviewTextAnnotationContext';
import InterviewDataModify from '../../InterviewDataDetail/InterviewDataModify';

function InterviewInspectionInfoModify() {
  const { document } = useContext(InterviewTextAnnotationContext);
  const { info, infoChange } = document || {};
  const { interviewId } = info || {};
  const [data, setData] = useState<any>([]); // 인터뷰 대상자

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

  const mutation = useMutation(fetchInterviewDetailDataModify, {
    onSuccess: handleMutationSuccess,
  });

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

  return (
    <FormProvider {...methods}>
      <CollapseBox title="인터뷰 정보" isOpen={false}>
        <InterviewDataModify
          data={data}
          setData={setData}
          readonly={!infoChange}
        />
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

export default memo(InterviewInspectionInfoModify);
