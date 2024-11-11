import { memo } from 'react';
import { Button, Col } from 'reactstrap';
import Selectbox from '~/components/shared/Selectbox';
import { useInterviewListSelectInfoQuery } from '~/hooks';

type Props = {
  selectedValues?: any;
  onSelectChange?: (key: string, value: any) => void;
  onResetClick?: () => void;
};

function InterviewDataSelectFilter({
  selectedValues,
  onSelectChange,
  onResetClick,
}: Props) {
  const { category, status } = selectedValues;

  const { data: selectInfo } = useInterviewListSelectInfoQuery();

  if (!selectInfo) return null;

  return (
    <div className="d-flex gap-2">
      <Col>
        <Selectbox
          name="category"
          placeholder="카테고리"
          onChange={({ value }) => onSelectChange?.('category', value)}
          items={selectInfo?.response.payload.selectCategory}
          value={category}
        />
      </Col>
      <Col>
        <Selectbox
          name="status"
          placeholder="상태"
          onChange={({ value }) => onSelectChange?.('status', value)}
          items={selectInfo?.response.payload.selectStatus}
          value={status}
        />
      </Col>
      <Button onClick={onResetClick}>
        <i className="bx bx-revision" />
      </Button>
    </div>
  );
}

export default memo(InterviewDataSelectFilter);
