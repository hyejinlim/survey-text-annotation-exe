import { memo } from 'react';
import { Button, Col } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import {
  fetchSurveyInspectionListSelectInfo,
  fetchSurveyListSelectInfo,
} from '~/api/fetches/fetchSurvey';
import Selectbox from '~/components/shared/Selectbox';

type Props = {
  selectedValues?: any;
  onSelectChange?: (key: string, value: any) => void;
  onResetClick?: () => void;
  type?: string; // 호출 api 분리 목적
};

function SurveyDataSelectFilter({
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
        return fetchSurveyInspectionListSelectInfo({ type });
      default:
        return fetchSurveyListSelectInfo();
    }
  };

  const { data: selectInfo } = useQuery({
    queryKey: ['surveyListSelectInfo', type],
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

export default memo(SurveyDataSelectFilter);
