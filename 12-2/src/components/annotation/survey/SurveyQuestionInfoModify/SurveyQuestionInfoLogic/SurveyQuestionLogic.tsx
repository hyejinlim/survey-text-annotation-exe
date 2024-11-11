import { memo } from 'react';
import { Button } from 'reactstrap';
import TextField from '~/components/shared/TextField';

type Props = {
  data: any;
  onItemClick: (name: string, key: string) => void;
  onSingleMinusCount: (key: string, index: number) => void;
  labelChange?: boolean;
};

function SurveyQuestionLogic({
  data,
  onItemClick,
  onSingleMinusCount,
  labelChange = false,
}: Props) {
  return (
    <div className="ps-2 py-2 d-flex gap-2 flex-column">
      {data.surveyLogic.map((item: any, index: number) => {
        return (
          <div key={index} className="d-flex flex-column gap-1">
            <div className="d-flex justify-content-between align-items-center">
              <span>로직 {index + 1}</span>
              {labelChange && (
                <Button
                  size="sm"
                  onClick={() => onSingleMinusCount('surveyLogic', index)}
                >
                  <i className="fas fa-minus" />
                </Button>
              )}
            </div>
            <div className="d-flex justify-content-between align-items-center ms-2">
              <span className="col-4">이동 문항</span>
              <TextField
                name={`surveyNextQNum_${index}`}
                value={item.surveyNextQNum}
                readOnly={true}
                onClick={onItemClick.bind(
                  null,
                  `로직 > 이동 문항 ${index + 1}`,
                  `surveyNextQNum_${index}`
                )}
              />
            </div>
            <div className="d-flex justify-content-between align-items-center ms-2">
              <span className="col-4">이동 문항 조건</span>
              <TextField
                name={`surveyNextQCondition_${index}`}
                value={item.surveyNextQCondition}
                readOnly={true}
                onClick={onItemClick.bind(
                  null,
                  `로직 > 이동 문항 조건 ${index + 1}`,
                  `surveyNextQCondition_${index}`
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default memo(SurveyQuestionLogic);
