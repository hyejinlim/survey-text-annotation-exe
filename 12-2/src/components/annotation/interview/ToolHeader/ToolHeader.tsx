import { memo, useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from 'reactstrap';
import Swal from 'sweetalert2';
import { InterviewTextAnnotationContext } from '~/libs/contexts/InterviewTextAnnotationContext';
import * as styles from './styles';

function ToolHeader() {
  const methods = useFormContext();
  const { document, exeLabelingList } = useContext(
    InterviewTextAnnotationContext
  );
  const { info } = document;

  const createJsonDownloadLink = ({ data, fileName, fileType }: any) => {
    const blob = new Blob([data], { type: fileType });
    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(a.href);
  };

  const handleClick = (values: any) => {
    console.log('values', values);
    console.log('exeLabelingList', exeLabelingList);

    if (exeLabelingList?.length === 0) {
      Swal.fire({
        icon: 'error',
        title: '문항별 정보를 작성해주세요.',
        confirmButtonText: '확인',
      });
      return;
    }

    const {
      interviewPurpose,
      interviewTopic,
      interviewTopicDetail,
      interviewKeyword,
      interviewTitle,
      interviewSource,
      interviewStyle,
      interviewType,
    } = values;

    const intervieweeList = Object.keys(values).reduce((acc: any, cur: any) => {
      const [key, index] = cur.split('_');
      if (
        /intervieweeAge/.exec(key) ||
        /intervieweeGender/.exec(key) ||
        /intervieweeKey/.exec(key) ||
        /intervieweeLocation/.exec(key)
      ) {
        const newData = { ...acc[index], [key]: values[cur] };
        acc[index] = newData;
        return acc;
      }
      return acc;
    }, []);

    const interviewJsonData = {
      id: 0,
      purpose: interviewPurpose,
      topic: {
        topic: interviewTopic?.label,
        topic_detailed: interviewTopicDetail?.label,
      },
      keyword: interviewKeyword,
      title: interviewTitle,
      source: interviewSource?.label,
      interviewer_sty: interviewStyle?.label,
      turns: exeLabelingList?.length,
      type: interviewType?.label,
      interviewee_num: intervieweeList?.length,
      interviewee: intervieweeList
        ?.map((data: any) => {
          const {
            intervieweeKey,
            intervieweeAge,
            intervieweeGender,
            intervieweeLocation,
          } = data;
          return {
            ...(intervieweeKey && { interviewee_id: intervieweeKey }),
            ...(intervieweeGender && { gender: intervieweeGender }),
            ...(intervieweeAge && { age: intervieweeAge }),
            ...(intervieweeLocation && { location: intervieweeLocation }),
          };
        })
        .filter((el: any) => Object.keys(el).length > 0),
    };

    const scriptJsonData = exeLabelingList?.map((data: any) => {
      const {
        interviewTurnId,
        interviewQContext,
        interviewQType,
        interviewQPurp,
        interviewQPost,
      } = data;

      const interviewAnswerList = Object.keys(data).reduce(
        (acc: any, cur: any) => {
          const [key, index] = cur.split('_');
          if (
            /interviewAKey/.exec(key) ||
            /interviewAContext/.exec(key) ||
            /interviewAType/.exec(key) ||
            /interviewAMatch/.exec(key)
          ) {
            const newData = { ...acc[index], [key]: data[cur] };
            acc[index] = newData;
            return acc;
          }
          return acc;
        },
        []
      );

      return {
        turn_id: interviewTurnId,
        question_info: {
          question_context: interviewQContext,
          question_type: interviewQType?.label,
          question_purp: interviewQPurp,
        },
        answer_info: interviewAnswerList
          ?.map((data: any) => {
            const {
              interviewAKey,
              interviewAContext,
              interviewAMatch,
              interviewAType,
            } = data;
            return {
              ...(interviewAKey && { interviewee_id: interviewAKey }),
              ...(interviewAContext && { answer_context: interviewAContext }),
              ...(interviewAMatch && { answer_match: interviewAMatch }),
              ...(interviewAType && { answer_type: interviewAType }),
            };
          })
          .filter((el: any) => Object.keys(el).length > 0),
        post_question: interviewQPost,
      };
    });

    console.log('scriptJsonData', scriptJsonData);

    const jsonData = {
      interview_info: interviewJsonData,
      script: scriptJsonData,
    };

    const name = `label`; //파일명
    createJsonDownloadLink({
      data: JSON.stringify(jsonData),
      fileName: `${name}.json`,
      fileType: 'text/json',
    });
  };

  return (
    <div css={styles.header}>
      <div className="font-size-20 fw-semibold">
        [12-2] {info?.interviewTitle}
      </div>
      <Button color="primary" onClick={methods.handleSubmit(handleClick)}>
        인터뷰 가공 완료
      </Button>
    </div>
  );
}

export default memo(ToolHeader);
