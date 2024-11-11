import {
  ChangeEvent,
  Fragment,
  memo,
  useContext,
  useRef,
  useState,
} from 'react';
import { Button } from 'reactstrap';
import { SurveyTextAnnotationContext } from '~/libs/contexts/SurveyTextAnnotationContext';
import * as styles from './styles';

function SelectTextData() {
  const { setDocument } = useContext(SurveyTextAnnotationContext);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClickFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // 파일 선택 창 비우기
      fileInputRef.current.click();
    }
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
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
          // labelingList: [
          //   {
          //     createMember: 0,
          //     createMemberName: null,
          //     createDatetime: "",
          //     updateMember: 0,
          //     updateMemberName: null,
          //     updateDatetime: "",
          //     labelingId: null,
          //     surveyId: null,
          //     surveyQNum: null,
          //     surveyContext: null,
          //     surveyQPart: null,
          //     surveyQPurpose: null,
          //     surveyAType: null,
          //     surveyATypeName: null,
          //     surveyAChoices: null,
          //     surveyLogicArray: [],
          //     surveyAChoicesParam: null,
          //     surveyAChoicesArray: [],
          //     surveyATypeView: null,
          //   },
          //   {
          //     createMember: 0,
          //     createMemberName: null,
          //     createDatetime: "",
          //     updateMember: 0,
          //     updateMemberName: null,
          //     updateDatetime: "",
          //     labelingId: null,
          //     surveyId: null,
          //     surveyQNum: null,
          //     surveyContext: null,
          //     surveyQPart: null,
          //     surveyQPurpose: null,
          //     surveyAType: null,
          //     surveyATypeName: null,
          //     surveyAChoices: null,
          //     surveyLogicArray: [],
          //     surveyAChoicesParam: null,
          //     surveyAChoicesArray: [],
          //     surveyATypeView: null,
          //   },
          // ],
        });
        setLoading(false);
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
