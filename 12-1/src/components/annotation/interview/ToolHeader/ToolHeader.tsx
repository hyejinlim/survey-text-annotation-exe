import { memo, useContext } from 'react';
import { Button } from 'reactstrap';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { fetchInterviewStatusModify } from '~/api/fetches/fetchInterview';
import { InterviewTextAnnotationContext } from '~/libs/contexts/InterviewTextAnnotationContext';
import * as styles from './styles';

function ToolHeader() {
  const { document, interviewId } = useContext(InterviewTextAnnotationContext);
  const { info } = document;

  const updateStatusMutation = useMutation(fetchInterviewStatusModify, {
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
          title: '인터뷰 가공이 완료되었습니다.',
          confirmButtonText: '확인',
        });
      }
    },
  });

  const handleClick = () => {
    const params = {
      interviewId,
      interviewStatus: 'Y',
    };
    updateStatusMutation.mutateAsync(params);
  };

  return (
    <div css={styles.header}>
      <div className="font-size-20 fw-semibold">
        [12-2] {info?.interviewTitle}
      </div>
      <Button color="primary" onClick={handleClick}>
        인터뷰 가공 완료
      </Button>
    </div>
  );
}

export default memo(ToolHeader);
