import { memo, useContext } from 'react';
import FormItemText from '~/components/form/FormItemText';
import CollapseBox from '~/components/shared/CollapseBox';
import { InterviewTextAnnotationContext } from '~/libs/contexts/InterviewTextAnnotationContext';

function InterviewInfo() {
  const { document } = useContext(InterviewTextAnnotationContext);
  const { info } = document || {};
  const {
    interviewTitle,
    interviewPurpose,
    interviewTopicName,
    interviewTopicDetailName,
    interviewKeywordName,
    interviewSourceName,
    interviewStyleName,
    interviewTypeName,
    intervieweeList,
  } = info || {};

  return (
    <CollapseBox title="인터뷰 정보" isOpen={false}>
      <div>
        <div className="px-3 py-2">
          <FormItemText label="인터뷰 제목" value={interviewTitle} />
          <FormItemText label="인터뷰 목적" value={interviewPurpose} />
          <FormItemText label="인터뷰 주제" value={interviewTopicName} />
          <FormItemText
            label="인터뷰 상세주제"
            value={interviewTopicDetailName}
          />
          <FormItemText label="인터뷰 키워드" value={interviewKeywordName} />
          <FormItemText label="인터뷰 출처" value={interviewSourceName} />
          <FormItemText label="인터뷰 성향" value={interviewStyleName} />
          <FormItemText label="인터뷰 종류" value={interviewTypeName} />
        </div>
        <div className="px-3 d-flex flex-column gap-3">
          {intervieweeList?.map((item: any, index: number) => {
            const {
              intervieweeKey,
              intervieweeGenderName,
              intervieweeAgeName,
              intervieweeLocation,
            } = item;
            return (
              <div key={index} className="d-flex flex-column gap-1">
                <span>인터뷰 대상자 {index + 1}</span>
                <div className="ms-2 d-flex flex-column gap-1">
                  <FormItemText label="대상자 아이디" value={intervieweeKey} />
                  <FormItemText
                    label="대상자 성별"
                    value={intervieweeGenderName}
                  />
                  <FormItemText
                    label="대상자 나이"
                    value={intervieweeAgeName}
                  />
                  <FormItemText
                    label="대상자 지역"
                    value={intervieweeLocation}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CollapseBox>
  );
}

export default memo(InterviewInfo);
