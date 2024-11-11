import { memo, useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from 'reactstrap';
import Swal from 'sweetalert2';
import { SurveyTextAnnotationContext } from '~/libs/contexts/SurveyTextAnnotationContext';
import * as styles from './styles';

function ToolHeader() {
  const methods = useFormContext();
  const { document, exeLabelingList } = useContext(SurveyTextAnnotationContext);
  const { info } = document;

  const getSurveyAChoicesArray = (data: any) => {
    return Object.keys(data)
      .reduce((acc: any, cur: any) => {
        if (/surveyAChoices/.exec(cur)) return [...acc, data[cur]];
        return acc;
      }, [])
      .filter((el: any) => el);
  };

  const createJsonDownloadLink = ({ data, fileName, fileType }: any) => {
    const blob = new Blob([data], { type: fileType });
    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(a.href);
  };

  const handleClick = (values: any) => {
    if (exeLabelingList?.length === 0) {
      Swal.fire({
        icon: 'error',
        title: '문항별 정보를 작성해주세요.',
        confirmButtonText: '확인',
      });
      return;
    }

    const {
      surveyPurpose,
      surveyMethod,
      surveyIndustry,
      surveyTopic,
      surveyTopicDetail,
      surveyKeyword,
      surveyCalculation,
      surveyCutoff,
      surveyCredibility,
      surveyValidity,
      surveyGender,
      surveyAge,
      surveyLocation,
    } = values;

    const surveyJsonData = {
      id: '',
      survey_purpose: surveyPurpose,
      method: surveyMethod?.label,
      industry: surveyIndustry?.label,
      topic: {
        topic: surveyTopic?.label,
        topic_detailed: surveyTopicDetail?.label,
      },
      keyword: surveyKeyword,
      q_result: {
        calculation: surveyCalculation,
        cutoff: surveyCutoff,
        credibility: surveyCredibility,
        validity: surveyValidity,
      },
      target_info: {
        gender: surveyGender?.label,
        age: surveyAge?.map(({ label }: any) => label),
        location: surveyLocation,
      },
    };

    exeLabelingList.forEach((data: any) => {
      const {
        surveyQNum,
        surveyContext,
        surveyQPart,
        surveyQPurpose,
        surveyAType,
      } = data;

      const surveyAChoicesArray = getSurveyAChoicesArray(data);

      const surveyLogicArray = Object.keys(data)
        .reduce((acc: any, cur: any) => {
          const [key, index] = cur.split('_');
          if (/surveyNextQNum/.exec(key) || /surveyNextQCondition/.exec(key)) {
            const newData = { ...acc[index], [key]: data[cur] };
            acc[index] = newData;
            return acc;
          }
          return acc;
        }, [])
        .filter((el: any) => el);

      const logicObj = surveyLogicArray.map((data: any) => {
        const { surveyNextQNum, surveyNextQCondition } = data;
        const filtered = exeLabelingList.filter(
          ({ surveyQNum }: any) => surveyQNum === surveyNextQNum
        )[0];
        const filteredSurveyAChoicesArray = filtered
          ? getSurveyAChoicesArray(filtered)
          : [];

        return {
          next_condition: surveyNextQCondition,
          next_q_num: surveyNextQNum,
          ...(filtered && {
            next_q_context: filtered?.surveyContext,
            next_answer: {
              next_type: filtered?.surveyAType?.label,
              next_num: filteredSurveyAChoicesArray?.length,
              next_choices: filteredSurveyAChoicesArray,
            },
          }),
        };
      });

      const questionJsonData = {
        q_num: surveyQNum,
        context: surveyContext,
        q_part: surveyQPart,
        q_purpose: surveyQPurpose,
        answer: {
          type: surveyAType?.label,
          num: surveyAChoicesArray?.length,
          choices: surveyAChoicesArray,
        },
        logic: logicObj,
      };

      const jsonData = {
        survey_info: surveyJsonData,
        question_info: questionJsonData,
      };

      const name = `label_${surveyQNum}`; //파일명
      createJsonDownloadLink({
        data: JSON.stringify(jsonData),
        fileName: `${name}.json`,
        fileType: 'text/json',
      });
    });
  };

  return (
    <div css={styles.header}>
      <div className="font-size-20 fw-semibold">[12-1] {info?.surveyTitle}</div>
      <Button color="primary" onClick={methods.handleSubmit(handleClick)}>
        설문지 작업 완료
      </Button>
    </div>
  );
}

export default memo(ToolHeader);
