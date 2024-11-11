import { Fragment, memo } from 'react';
import { Button } from 'reactstrap';
import clsx from 'clsx';

type Props = {
  labelingListLength: number;
  labelingId: number;
  labelingIndex: number;
  setLabelingIndex: React.Dispatch<React.SetStateAction<number>>;
  onDelete: () => void;
  onSave?: () => void;
  onRequest?: () => void;
};

function SurveyQuestionInfoButtons({
  labelingListLength,
  labelingId,
  labelingIndex,
  setLabelingIndex,
  onDelete,
  onSave,
  onRequest,
}: Props) {
  const handlePrev = () => {
    if (labelingIndex !== 0) setLabelingIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setLabelingIndex((prev) => prev + 1);
  };

  return (
    <div
      className={clsx('pt-4 pb-4 d-flex px-2', {
        'justify-content-between': labelingListLength > 0,
        'justify-content-center': labelingListLength === 0,
      })}
    >
      {labelingListLength > 0 && (
        <Fragment>
          <Button
            color="light"
            onClick={handlePrev}
            disabled={labelingIndex === 0}
          >
            <i className="mdi mdi-arrow-left-bold" />
          </Button>
          <div className="d-flex gap-1">
            <Button color="danger" onClick={onDelete}>
              삭제
            </Button>
          </div>
          <Button color="light" onClick={handleNext}>
            <i className="mdi mdi-arrow-right-bold" />
          </Button>
        </Fragment>
      )}
    </div>
  );
}

export default memo(SurveyQuestionInfoButtons);
