import { memo, useContext, useEffect, useRef } from 'react';
import { SurveyTextAnnotationContext } from '~/libs/contexts/SurveyTextAnnotationContext';
import * as styles from './styles';

function SurveyTextAnnotation() {
  const ref = useRef<HTMLDivElement>(null);
  const { document, setSelectedText } = useContext(SurveyTextAnnotationContext);
  const { info } = document;
  const { surveyText } = info || {};

  const handleMouseUp = ({ type }: any) => {
    if (type === 'mouseup') {
      setSelectedText(window.getSelection()!.toString().replace(/\n/g, ''));
    }
  };

  useEffect(() => {
    if (!!ref.current) ref.current.scrollTop = 0;
  }, [surveyText]);

  if (!surveyText)
    return <div css={styles.empty}>작업할 데이터를 선택해주세요.</div>;

  return (
    <div ref={ref} css={styles.container}>
      <div
        onMouseUp={handleMouseUp}
        dangerouslySetInnerHTML={{
          __html: surveyText,
        }}
      />
    </div>
  );
}
export default memo(SurveyTextAnnotation);
