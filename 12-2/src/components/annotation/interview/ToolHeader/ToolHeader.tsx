import { memo, useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from 'reactstrap';
import { InterviewTextAnnotationContext } from '~/libs/contexts/InterviewTextAnnotationContext';
import * as styles from './styles';

function ToolHeader() {
  const methods = useFormContext();
  const { document, exeLabelingList } = useContext(
    InterviewTextAnnotationContext
  );
  const { info } = document;

  const handleClick = (values: any) => {
    console.log('values', values);
    console.log('exeLabelingList', exeLabelingList);
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
