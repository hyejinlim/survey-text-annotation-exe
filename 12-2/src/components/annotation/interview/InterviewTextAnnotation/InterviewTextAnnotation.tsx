import { memo, useContext, useEffect, useRef } from 'react';
import { InterviewTextAnnotationContext } from '~/libs/contexts/InterviewTextAnnotationContext';
import * as styles from './styles';

function InterviewTextAnnotation() {
  const ref = useRef<HTMLDivElement>(null);
  const { document, setSelectedText } = useContext(
    InterviewTextAnnotationContext
  );
  const { info } = document;
  const { interviewText } = info || {};

  const handleMouseUp = ({ type }: any) => {
    if (type === 'mouseup') {
      setSelectedText(window.getSelection()!.toString().replace(/\n/g, ''));
    }
  };

  useEffect(() => {
    if (!!ref.current) ref.current.scrollTop = 0;
  }, [interviewText]);

  if (!interviewText)
    return <div css={styles.empty}>작업할 데이터를 선택해주세요.</div>;

  return (
    <div ref={ref} css={styles.container}>
      <div
        onMouseUp={handleMouseUp}
        dangerouslySetInnerHTML={{
          __html: interviewText,
        }}
      />
    </div>
  );
}
export default memo(InterviewTextAnnotation);
