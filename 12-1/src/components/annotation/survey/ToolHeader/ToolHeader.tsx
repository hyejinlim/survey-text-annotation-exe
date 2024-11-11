import { memo, useContext } from 'react';
import { Button } from 'reactstrap';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { fetchSurveyStatusModify } from '~/api/fetches/fetchSurvey';
import { SurveyTextAnnotationContext } from '~/libs/contexts/SurveyTextAnnotationContext';
import * as styles from './styles';

function ToolHeader() {
  const { document, surveyId } = useContext(SurveyTextAnnotationContext);
  const { info } = document;

  const updateStatusMutation = useMutation(fetchSurveyStatusModify, {
    onSuccess: (data: any) => {
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
          title: '설문지 작업이 완료되었습니다.',
          confirmButtonText: '확인',
        });
      }
    },
  });

  const handleClick = () => {
    const params = {
      surveyId,
      surveyStatus: 'Y',
    };
    updateStatusMutation.mutateAsync(params);
  };

  return (
    <div css={styles.header}>
      <div className="font-size-20 fw-semibold">[12-1] {info?.surveyTitle}</div>
      <Button color="primary" onClick={handleClick}>
        설문지 작업 완료
      </Button>
    </div>
  );
}

export default memo(ToolHeader);
