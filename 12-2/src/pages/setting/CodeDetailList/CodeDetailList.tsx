import { memo, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { Container } from 'reactstrap';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import {
  fetchCodeDetailCreate,
  fetchCodeDetailModify,
  fetchModifyCodeDetailOpen,
} from '~/api/setting/codeDetail';
import { FetchCodeDetailType } from '~/api/setting/codeDetail/types';
import CodeDetailModal from '~/components/modals/CodeDetailModal';
import Breadcrumb from '~/components/shared/Breadcrumb';
import CreateButton from '~/components/shared/CreateButton';
import TableContainer from '~/components/shared/TableContainer';
import { useCodeDetailListQuery } from '~/hooks';
import { getColumns } from './constants';

type CodeDetailType = {
  codeDetailId: string;
  codeDetailName: string;
  codeDetailDescript: string;
  codeDetailOpenTF: boolean;
};

function CodeDetailList() {
  const { codeId } = useParams();
  const [show, setShow] = useState<boolean>(false); // modal
  const [codeDetail, setCodeDetail] = useState<CodeDetailType | null>();

  const { data, refetch } = useCodeDetailListQuery({
    paging: false,
    codeListId: codeId,
    codeDetailList: true,
  });

  /** 상세 코드 생성 */
  const addCodeMutation = useMutation(fetchCodeDetailCreate, {
    onSuccess: ({ response }) => {
      const { result, message } = response.payload;
      if (result === 'error') {
        Swal.fire({
          icon: 'error',
          title: `${message}`,
          confirmButtonText: '확인',
        });
      } else {
        refetch();
        handleClose();
        Swal.fire({
          icon: 'success',
          title: '정상적으로 추가되었습니다',
          confirmButtonText: '확인',
        });
      }
    },
  });

  /** 상세 코드 수정 */
  const updateCodeMutation = useMutation(fetchCodeDetailModify, {
    onSuccess: () => {
      refetch();
      Swal.fire({
        icon: 'success',
        title: '정상적으로 수정되었습니다',
        confirmButtonText: '확인',
      });
    },
  });

  /** 사용여부 수정 */
  const updateCodeOpenMutation = useMutation(fetchModifyCodeDetailOpen, {
    onSuccess: () => {
      refetch();
    },
  });

  const handleClick = useCallback(() => {
    setShow(true);
  }, []);

  const handleEdit = useCallback(
    (codeDetailId: string) => {
      if (data?.response?.payload) {
        const res = data?.response.payload.find(
          (code: any) => code.codeDetailId === codeDetailId
        );

        setCodeDetail(res);
        setShow(true);
      }
    },
    [data]
  );

  const handleClose = useCallback(() => {
    setCodeDetail(null);
    setShow(false);
  }, []);

  const handleCodeDetailCreate = (values: FetchCodeDetailType) => {
    addCodeMutation.mutate({ ...values, codeListId: codeId });
  };

  const handleCodeDetailModify = (values: FetchCodeDetailType) => {
    updateCodeMutation.mutate({ ...values, codeListId: codeId });
    handleClose();
  };

  const handleSwitch = useCallback((values: FetchCodeDetailType) => {
    updateCodeOpenMutation.mutate({ ...values });
  }, []);

  const columns = useMemo(
    () => getColumns(handleEdit, handleSwitch, codeId),
    [codeId, data]
  );

  if (!data) return null;
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb
          title="세팅"
          breadcrumbItem={`${data.response.info.codeListName} 분류 관리`}
        />
        <TableContainer
          columns={columns}
          data={data?.response.payload}
          isGlobalFilter={true}
          isListOptionVisible
          isCheckbox={false}
          createButton={
            <CreateButton
              title="상세 코드 생성"
              color="primary"
              onClick={handleClick}
            />
          }
        />
      </Container>
      {show && (
        <CodeDetailModal
          show={show}
          submitText={codeDetail ? '수정' : '생성'}
          item={codeDetail}
          onClose={handleClose}
          onSubmit={
            codeDetail ? handleCodeDetailModify : handleCodeDetailCreate
          }
        />
      )}
    </div>
  );
}

export default memo(CodeDetailList);
