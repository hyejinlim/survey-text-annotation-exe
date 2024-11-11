import { Fragment, memo, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router';
import { Label, Button, FormFeedback } from 'reactstrap';
import { useMutation, useQuery } from '@tanstack/react-query';
import L from 'lodash';
import Swal from 'sweetalert2';
import {
  fetchBoardDetail,
  fetchBoardFileUpload,
  fetchInsertNotice,
  fetchInsertQna,
} from '~/api/fetches/fetchBoard';
import Loading from '~/components/shared/Loading';
import Selectbox from '~/components/shared/Selectbox';
import TextField from '~/components/shared/TextField';
import { MENU0601, MENU0602 } from '~/constants/menu';
import { useCheckAuthorityQuery, useCodeDetailListQuery } from '~/hooks';
import { getNoticeFormSchema } from '~/validations/board/noticeFormValidation';
import { modules } from './constants';
import { getInitialFormValues } from './functions';
import * as styles from './styles';
import CommentForm from '../CommentForm';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-quill/dist/quill.snow.css';

type Props = {
  item?: any;
  textSubmit?: string;
  formType?: string;
  create?: boolean;
};

function NoticeForm({ item, textSubmit, formType, create }: Props) {
  const { nid, iid } = useParams();
  const navigate = useNavigate();
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({ resolver: getNoticeFormSchema() });
  const [editorState, setEditorState] = useState();
  const [files, setFiles] = useState<any>([]);
  const [edit, setEdit] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: authority, isLoading: authorityLoading } =
    useCheckAuthorityQuery(formType === 'notice' ? MENU0601 : MENU0602);

  const { refetch } = useQuery({
    queryKey: ['noticeDetail', nid],
    queryFn: () => fetchBoardDetail(nid),
    enabled: !!nid,
  });

  const { refetch: qnaRefetch } = useQuery({
    queryKey: ['qnaDetail', iid],
    queryFn: () => fetchBoardDetail(iid),
    enabled: !!iid,
  });

  const { data: categoryDetail } = useCodeDetailListQuery({
    paging: false,
    codeDetailOpen: 'Y',
    codeListId: 'noticeCategory',
  });

  // 파일 업로드
  const postFileUploadMutation = useMutation(fetchBoardFileUpload);

  const postNoticeFormMutation = useMutation(fetchInsertNotice, {
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: `성공적으로 작성 되었습니다.`,
        confirmButtonText: '확인',
      }).then(() => {
        if (item) {
          setEdit(false);
          refetch();
        } else {
          navigate('/board/notice');
        }
      });
    },
  });

  const postBoardMutation = useMutation(fetchInsertQna, {
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: `성공적으로 작성 되었습니다.`,
        confirmButtonText: '확인',
      }).then(() => {
        if (item) {
          setEdit(false);
          qnaRefetch();
        } else {
          navigate('/board/qna');
        }
      });
    },
  });

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = ({ name, value }: any) => {
    setValue(name, value, { shouldValidate: true });
  };

  const handleBack = () => {
    navigate(-1);
  };

  // 에디터 내용이 변경될 때마다 호출되는 함수
  const handleEditorChange = (value: any) => {
    setEditorState(value);
  };

  const handleClick = (values: any) => {
    const { title, link, category } = values;

    const fileIds = files.map(({ fileId }: { fileId: number }) => fileId);
    const commonData = {
      noticeTitle: title,
      noticeContents: editorState,
      fileIdList: fileIds,
    };

    if (formType === 'notice') {
      const newNotice = {
        noticeId: nid ?? 0,
        noticeLink: '',
        noticeCategory: '',
        ...commonData,
      };

      postNoticeFormMutation.mutate({ ...newNotice });
    } else {
      const newData = {
        noticeId: iid ?? 0,
        noticeLink: link,
        noticeCategory: category,
        ...commonData,
      };

      postBoardMutation.mutate(newData);
    }
  };

  // 이미지 추가 함수
  const addFile = (data: any) => {
    setFiles((prev: any) => [data, ...prev]);
  };

  // 파일업로드
  const handleAcceptedFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    const formDataArray = Array.from(files).map((file: any) => {
      const formData = new FormData();
      formData.append('file', file);
      return { file, formData };
    });

    try {
      Promise.all(
        formDataArray.map(async (formDataObj) => {
          const response = await postFileUploadMutation.mutateAsync(
            formDataObj.formData
          );

          const { fileId, fileOriginName } = response.response.payload.info;
          const { result } = response.response.payload;

          addFile({
            fileId: fileId,
            fileOriginName: fileOriginName,
            result: result,
          });
        })
      );
    } catch (error) {
      console.error('Error occurred while uploading files:', error);
    }
  };

  useEffect(() => {
    if (item) {
      setFiles(item.file);
    }
  }, [item]);

  // 파일 삭제하기
  const handleDeleteFile = (fileId: string) => {
    const updatedFiles = files.filter((file: any) => file.fileId !== fileId);

    setFiles(updatedFiles);
  };

  /**
   * useEffect
   */
  const registerForm = () => {
    const initialFormValues = getInitialFormValues(item);

    L.flow([
      L.toPairs,
      (data) => {
        L.forEach(data, ([name, value]) => {
          if (L.isEmpty(item)) {
            register(name);
          }

          setValue(name, value);
        });
      },
    ])(initialFormValues);
  };

  useEffect(() => {
    if (item) {
      trigger();
    }
    registerForm();
  }, [register, setValue]);

  useEffect(() => {
    if (item) {
      setFiles(item.file);
      setEditorState(item.text);
    }
  }, [item]);

  if (authorityLoading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <div className="mb-5">
        {formType === 'qna' && (
          <div className="mb-3 gx-0">
            <Label>
              <strong>카테고리</strong>
            </Label>
            <Selectbox
              name="category"
              onChange={handleChange}
              value={getValues('category')}
              items={categoryDetail?.response.payload}
              disabled={!create && !edit}
            />
          </div>
        )}
        <div className="mb-3">
          <Label>
            <strong>제목</strong>
          </Label>
          <TextField
            name="title"
            value={getValues('title')}
            onChange={handleChange}
            placeholder="제목을 입력해주세요."
            invalid={!!errors?.title}
            disabled={item && !edit}
          />
          {!!errors?.title && (
            <FormFeedback type="invalid">{errors?.title?.message}</FormFeedback>
          )}
        </div>
        <div className="d-flex mb-5" css={styles.quillWrapper}>
          {!create && !edit ? (
            <div
              css={styles.inner}
              className="p-3 border rounded"
              dangerouslySetInnerHTML={{ __html: item.text }}
            />
          ) : (
            <ReactQuill
              value={editorState}
              onChange={handleEditorChange}
              modules={modules}
            />
          )}
        </div>
        <div className="mb-4 d-flex flex-column">
          {formType === 'qna' && (
            <Label>
              <strong>링크</strong>
            </Label>
          )}
          {formType === 'qna' && !create && (
            <>
              {!edit ? (
                item.link ? ( // item.link가 존재하는 경우에만 링크를 보여줍니다.
                  <a href={item.link}>{item.link}</a>
                ) : (
                  <span>링크 없음</span> // item.link가 없는 경우 "링크 없음"을 보여줍니다.
                )
              ) : (
                <TextField
                  name="link"
                  value={getValues('link')}
                  onChange={handleChange}
                />
              )}
            </>
          )}
          {formType === 'qna' && create && (
            <TextField
              name="link"
              value={getValues('link')}
              onChange={handleChange}
            />
          )}
        </div>
        <div className="d-flex gap-2 justy-content-center align-items-center">
          <Label>
            <strong>첨부파일</strong>
          </Label>
          {(create || edit) && (
            <>
              <Button
                color="primary"
                type="submit"
                onClick={handleFileInputClick}
                outline
              >
                {postFileUploadMutation.isLoading && (
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  />
                )}
                첨부파일
              </Button>
              <form>
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleAcceptedFiles}
                  ref={fileInputRef}
                />
              </form>
            </>
          )}
        </div>
        {files.map((file: any) => {
          const { fileId, fileOriginName, downloadURL } = file;
          return (
            <div key={fileId} className="d-flex mt-2 gap-2">
              <a href={downloadURL}>{fileOriginName}</a>
              {(create || edit) && (
                <Button
                  outline
                  color="danger"
                  size="sm"
                  onClick={() => handleDeleteFile(fileId)}
                >
                  삭제
                </Button>
              )}
            </div>
          );
        })}
      </div>
      <div className="d-flex justify-content-center align-items-center gap-2 text-items-center flex-wrap mb-3">
        <Button color="secondary" onClick={handleBack}>
          뒤로
        </Button>
        {authority?.response.payload.menu.menuU && (
          <>
            {(nid || iid) && !edit ? ( // 수정 모드일 때, edit가 false인 경우
              <Button color="primary" onClick={() => setEdit(true)}>
                {textSubmit}
              </Button>
            ) : (
              (nid || iid) &&
              edit && ( // 서버에 수정사항 저장하는 버튼
                <Button color="warning" onClick={handleSubmit(handleClick)}>
                  {nid && postNoticeFormMutation.isLoading && (
                    <div
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                  )}
                  {iid && postBoardMutation.isLoading && (
                    <div
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                  )}
                  변경사항 저장
                </Button>
              )
            )}
          </>
        )}
        {!(nid || iid) && ( // nid와 iid가 모두 없을 때 신규일때
          <Button color="primary" onClick={handleSubmit(handleClick)}>
            {!nid && postNoticeFormMutation.isLoading && (
              <div
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
            )}
            {!iid && postBoardMutation.isLoading && (
              <div
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
            )}

            <span>{textSubmit}</span>
          </Button>
        )}
      </div>
      {iid && (
        <CommentForm data={item.comment} iid={iid} refetch={qnaRefetch} />
      )}
    </Fragment>
  );
}

export default memo(NoticeForm);
