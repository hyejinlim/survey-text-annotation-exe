import { memo } from 'react';
import { Button, Col } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import {
  fetchInterviewInspectionListSelectInfo,
  fetchInterviewListSelectInfo,
} from '~/api/fetches/fetchInterview';
import Selectbox from '~/components/shared/Selectbox';

type Props = {
  selectedValues?: any;
  onSelectChange?: (key: string, value: any) => void;
  onResetClick?: () => void;
  type?: string; // 호출 api 분리 목적
};

function InterviewDataSelectFilter({
  selectedValues,
  onSelectChange,
  onResetClick,
  type,
}: Props) {
  const { category, status } = selectedValues;

  const fetched = () => {
    switch (type) {
      case 'I1':
      case 'I2':
      case 'F':
        return fetchInterviewInspectionListSelectInfo({ type });
      default:
        return fetchInterviewListSelectInfo();
    }
  };

  const { data: selectInfo } = useQuery({
    queryKey: ['interviewListSelectInfo', type],
    queryFn: () => fetched(),
  });

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
