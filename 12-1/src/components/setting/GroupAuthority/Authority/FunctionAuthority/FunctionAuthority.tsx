import { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { Button, Input, Table } from 'reactstrap';
import { useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import {
  fetchInsertAuthorityFunctionList,
  fetchgetAuthorityFunctionList,
} from '~/api/setting/authority';
import Loading from '~/components/shared/Loading';
import * as styles from './styles';
import { FunctionType } from '../types';

type Props = {
  mid: string;
};
function FunctionAuthority({ mid }: Props) {
  const [functionRows, setFunctionRows] = useState<FunctionType[]>([]);

  const { data: functionList } = useQuery({
    queryKey: ['functionList', mid],
    queryFn: () => fetchgetAuthorityFunctionList(mid),
    enabled: !!mid,
  });

  const mutation = useMutation(fetchInsertAuthorityFunctionList, {
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: '변경사항이 저장되었습니다',
        confirmButtonText: '확인',
      });
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: '변경사항 저장에 실패되었습니다.',
        confirmButtonText: '확인',
      });
    },
  });

  const handleFunctionChange = (params: any, field: any) => {
    const updatedRows = functionRows.map((row: any) => {
      if (row.id === params.id) {
        return {
          ...row,
          [field]: !row[field],
        };
      }
      return row;
    });

    setFunctionRows(updatedRows);
  };

  /** 기능 권한 저장 */
  const handleFunctionSubmit = useCallback(() => {
    const inserValues = {
      memberNo: mid,
      insertValue: functionRows,
    };
    mutation.mutate({ ...inserValues });
  }, [functionRows]);

  useEffect(() => {
    if (functionList) setFunctionRows(functionList.response.payload);
  }, [functionList]);

  if (!functionList) return <Loading />;
  return (
    <Fragment>
      {functionRows.map((data: FunctionType) => {
        const { id, menuName, img, labelling, imgUpload, imgDelete } = data;
        return (
          <div className="table-responsive" key={id} css={styles.table}>
            <Table className="table table-bordered mb-0">
              <thead className="bg-light-subtle">
                <tr>
                  <th></th>
                  <th>데이터 검수</th>
                  <th>라벨링 검수</th>
                  <th>데이터 업로드</th>
                  <th>데이터 삭제</th>
                </tr>
              </thead>
              <tbody css={styles.tbody}>
                <tr>
                  <td css={styles.wide}>{menuName}</td>
                  <td>
                    <Input
                      readOnly
                      css={styles.check}
                      type="checkbox"
                      checked={img || false}
                      onClick={() => handleFunctionChange(data, 'img')}
                    />
                  </td>
                  <td>
                    <Input
                      readOnly
                      css={styles.check}
                      type="checkbox"
                      checked={labelling || false}
                      onClick={() => handleFunctionChange(data, 'labelling')}
                    />
                  </td>
                  <td>
                    <Input
                      readOnly
                      css={styles.check}
                      type="checkbox"
                      checked={imgUpload || false}
                      onClick={() => handleFunctionChange(data, 'imgUpload')}
                    />
                  </td>
                  <td>
                    <Input
                      readOnly
                      css={styles.check}
                      type="checkbox"
                      checked={imgDelete || false}
                      onClick={() => handleFunctionChange(data, 'imgDelete')}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        );
      })}
      <div className="d-flex justify-content-end py-3">
        <Button
          color="primary"
          variant="contained"
          onClick={handleFunctionSubmit}
          size="lg"
        >
          {mutation.isLoading && (
            <div
              className="spinner-border spinner-border-sm me-2"
              role="status"
            />
          )}
          저장
        </Button>
      </div>
    </Fragment>
  );
}

export default memo(FunctionAuthority);
