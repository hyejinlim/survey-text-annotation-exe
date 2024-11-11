import {
  ChangeEvent,
  Fragment,
  memo,
  useContext,
  useRef,
  useState,
} from 'react';
import { Button } from 'reactstrap';
import Swal from 'sweetalert2';
import { SurveyTextAnnotationContext } from '~/libs/contexts/SurveyTextAnnotationContext';
import * as styles from './styles';

function SelectTextData() {
  const { setDocument, setReset, exeLabelingList } = useContext(
    SurveyTextAnnotationContext
  );
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClickFileInput = () => {
    if (exeLabelingList.length > 0) {
      Swal.fire({
        icon: 'info',
        title: '파일을 변경하시겠습니까?',
        text: '작성하신 내용은 저장되지 않습니다.',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: `취소`,
      }).then((result) => {
        const { isConfirmed } = result;
        if (isConfirmed) {
          if (fileInputRef.current) {
            fileInputRef.current.value = ''; // 파일 선택 창 비우기
            fileInputRef.current.click();
          }
        }
      });
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // 파일 선택 창 비우기
        fileInputRef.current.click();
      }
    }
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setReset(true);
    const files = event.target.files;
    if (!files) return;

    let fileReader = new FileReader();
    fileReader.readAsText(files[0]);
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        setDocument({
          info: {
            surveyText: fileReader.result,
            surveyTitle: files[0]?.name,
          },
        });
        setLoading(false);
        setReset(false);
      }
    };
  };

  return (
    <Fragment>
      <div css={styles.title}>목록</div>
      <div className="d-flex gap-2 p-2 justify-content-center">
        <div className="w-100">
          <Button
            block
            color="primary"
            type="submit"
            onClick={handleClickFileInput}
          >
            {loading ? (
              <>
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></div>
                파일 업로드중
              </>
            ) : (
              '업로드'
            )}
          </Button>
          <form>
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleFile}
              ref={fileInputRef}
              accept=".txt"
            />
          </form>
        </div>
      </div>
    </Fragment>
  );
}

export default memo(SelectTextData);
