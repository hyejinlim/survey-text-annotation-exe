import { memo, useState, useRef } from 'react';
import { Row, Button, Col, Table, Alert } from 'reactstrap';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import * as R from 'ramda';
import {
  fetchSurveyFileInsert,
  fetchSurveyFileUpload,
} from '~/api/fetches/fetchSurvey';
import { MENU0301 } from '~/constants/menu';
import { useCheckAuthorityQuery } from '~/hooks';
import * as styles from './styles';

/**
 * upload: 임시파일 업로드
 * insert: 최종 업로드
 */
function SurveyDataUpload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const { data: authority } = useCheckAuthorityQuery(MENU0301);

  const surveyFileUploadMutation = useMutation(fetchSurveyFileUpload);
  const surveyFileInsertMutation = useMutation(fetchSurveyFileInsert);

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 선택 파일 추가
  const addSelectedFile = (data: any) => {
    setSelectedFiles((prev: any) => [...prev, data]);
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const formDataArray = Array.from(files).map((file: any) => {
      const formData = new FormData();
      formData.append('file', file);
      return { file, formData };
    });

    try {
      Promise.all(
        formDataArray.map(async ({ formData }) => {
          const { response } = await surveyFileUploadMutation.mutateAsync(
            formData
          );
          const { result, message, info } = response.payload;

          if (result === 'error') {
            Swal.fire({
              icon: 'error',
              text: message,
              confirmButtonText: '확인',
            });
            return;
          }

          const { fileId, fileOriginName } = info;

          addSelectedFile({
            fileId,
            fileOriginName,
            result,
          });
        })
      );
    } catch (error) {
      console.error('Error occurred while uploading files:', error);
    }
  };

  // 파일 업로드
  const handleUpload = () => {
    if (R.isEmpty(selectedFiles)) {
      Swal.fire({
        icon: 'error',
        title: '업로드 데이터가 없습니다.',
        confirmButtonText: '확인',
      });
      return;
    }

    setUploadLoading(true);
    try {
      Promise.all(
        selectedFiles.map(async ({ fileId, result }: any) => {
          if (result !== 'upload') {
            const { response } = await surveyFileInsertMutation.mutateAsync({
              fileId,
            });
            const { result, message } = response.payload;
            if (result === 'error') {
              Swal.fire({
                icon: 'error',
                text: message,
                confirmButtonText: '확인',
              });
              return;
            }

            const fileIndex = selectedFiles.findIndex(
              (item: any) => item.fileId === fileId
            );
            if (fileIndex !== -1) {
              // result 값이 success인 경우
              if (result === 'success') {
                setSelectedFiles((prev: any) => {
                  return prev.map((file: any, index: any) => {
                    if (index === fileIndex) {
                      return {
                        ...file,
                        result: 'upload',
                      };
                    }
                    return file;
                  });
                });
              }
              // result 값이 error인 경우
              else if (result === 'error') {
                setSelectedFiles((prev: any) => {
                  return prev.map((file: any, index: any) => {
                    if (index === fileIndex) {
                      return {
                        ...file,
                        result: 'fail',
                      };
                    }
                    return file;
                  });
                });
              }
            }
          }
        })
      ).finally(() => {
        setUploadLoading(false); // 모두 업로드 완료되었을때 상태 업데이트
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 파일 개별 삭제
  const handleDelete = (fileId: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedFiles((prev: any) =>
      prev.filter((file: any) => file.fileId !== fileId)
    );
  };

  return (
    <>
      <Row className="mb-3">
        <div className="d-flex justify-content-start gap-3">
          <Col className="d-flex gap-2">
            {authority?.response.payload.function.imgUpload && (
              <Button
                block
                color="success"
                type="submit"
                onClick={handleFileInputClick}
                disabled={uploadLoading}
              >
                {surveyFileUploadMutation.isLoading ? (
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : null}
                Zip 파일선택
              </Button>
            )}
            <form>
              <input
                multiple
                type="file"
                disabled={surveyFileUploadMutation.isLoading}
                style={{ display: 'none' }}
                onChange={handleChangeFile}
                ref={fileInputRef}
                accept=".zip"
              />
            </form>
            <Button
              style={{ width: 140 }}
              color="primary"
              disabled={uploadLoading}
              onClick={handleUpload}
            >
              {uploadLoading && (
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
              {uploadLoading ? '업로드 중' : '전체 업로드'}
            </Button>
          </Col>
        </div>
      </Row>
      <Row className="d-flex flex-column justify-content-center align-items-center">
        {selectedFiles && (
          <Col className="d-flex flex-column justify-content-center align-items-center">
            {(uploadLoading || surveyFileUploadMutation.isLoading) && (
              <div css={styles.alert}>
                <Alert color="danger">
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  {uploadLoading ? '업로드' : '로딩'} 중입니다. 페이지를 닫거나
                  이동하시면 중단됩니다.
                </Alert>
              </div>
            )}
            <Table className="table table-striped mb-0">
              <tbody>
                {selectedFiles.map((file: any) => {
                  const { fileId, fileOriginName, result } = file;
                  if (result === 'upload') return null;
                  return (
                    <tr key={fileId}>
                      <td>
                        <div
                          className="d-flex gap-1 align-items-center"
                          css={styles.tdHeight}
                        >
                          <i className="mdi mdi-folder-zip-outline" />
                          <strong>{fileOriginName}</strong>
                        </div>
                      </td>
                      <td className="text-center">
                        <div css={styles.tdHeight}>
                          <Button
                            color="danger"
                            onClick={() => handleDelete(fileId)}
                          >
                            삭제
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        )}
      </Row>
    </>
  );
}

export default memo(SurveyDataUpload);
