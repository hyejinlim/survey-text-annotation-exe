import { memo } from 'react';
import { Button } from 'reactstrap';
import clsx from 'clsx';

type Props = {
  labelingListLength: number;
  labelingId: number;
  labelingIndex: number;
  setLabelingIndex: React.Dispatch<React.SetStateAction<number>>;
  onDelete: () => void;
  onSave: () => void;
  readonly?: boolean;
  inspectionType?: string;
};

function InterviewQuestionInfoButtons({
  labelingListLength,
  labelingId,
  labelingIndex,
  setLabelingIndex,
  onDelete,
  onSave,
  readonly = false,
  inspectionType,
}: Props) {
  const handlePrev = () => {
    if (labelingIndex !== 0) setLabelingIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (inspectionType === 'F' && labelingListLength - 1 <= labelingIndex)
      return;
    setLabelingIndex((prev) => prev + 1);
  };

  return (
    <div
      className={clsx('pt-4 pb-4 d-flex px-2', {
        'justify-content-between': labelingListLength > 1,
        'justify-content-center': labelingListLength === 1,
      })}
    >
      {labelingListLength > 1 && (
        <Button color="light" onClick={handlePrev}>
          <i className="mdi mdi-arrow-left-bold" />
        </Button>
      )}
      {!readonly && (
        <div className="d-flex gap-1">
          <Button color="info" type="submit" onClick={onSave}>
            저장
          </Button>
          {labelingId && (
            <Button color="danger" onClick={onDelete}>
              삭제
            </Button>
          )}
        </div>
      )}
      {labelingListLength > 1 && (
        <Button color="light" onClick={handleNext}>
          <i className="mdi mdi-arrow-right-bold" />
        </Button>
      )}
    </div>
  );
}

export default memo(InterviewQuestionInfoButtons);
