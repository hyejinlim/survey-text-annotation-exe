import { memo, useState, useCallback, useEffect } from 'react';
import { Container } from 'reactstrap';
import { useQuery, useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import {
  fetchCreateCode,
  fetchCodeList,
  fetchModifyCode,
} from '~/api/setting/code';
import CodeModal from '~/components/modals/CodeModal';
import Breadcrumb from '~/components/shared/Breadcrumb';
import CreateButton from '~/components/shared/CreateButton';
import TableContainer from '~/components/shared/TableContainer';
import { MENU0503 } from '~/constants/menu';
import { useCheckAuthorityQuery } from '~/hooks';
import { columns } from './constants';

type CodeType = {
  codeListId: string;
  codeListName: string;
  codeListDescript: string;
};
function CodeList() {
  const [show, setShow] = useState<boolean>(false); // modal
  const [codeListData, setCodeListData] = useState<CodeType[]>([]);
  const [code, setCode] = useState<CodeType | null>(null);

  const {
    data,
    isLoading: codeListLoading,
    refetch,
  } = useQuery({
    queryKey: ['codeList'],
    queryFn: () => fetchCodeList(),
  });

  const { data: authority, isLoading: authorityLoading } =
    useCheckAuthorityQuery(MENU0503);

  /** 공통 코드 생성 */
  const addCodeMutation = useMutation(fetchCreateCode, {
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

  /** 공통 코드 수정 */
  const updateCodeMutation = useMutation(fetchModifyCode, {
    onSuccess: () => {
      refetch();
      Swal.fire({
        icon: 'success',
        title: '정상적으로 수정되었습니다',
        confirmButtonText: '확인',
      });
    },
  });

  const handleClick = useCallback(() => {
    setShow(true);
  }, []);

  const handleEdit = (codeListId: string) => {
    if (codeListData) {
      const res = codeListData.find((code) => code.codeListId === codeListId);
      if (res) {
        setCode(res);
        setShow(true);
      }
    }
  };

  const handleClose = useCallback(() => {
    setCode(null);
    setShow(false);
  }, []);

  const handleCodeCreate = (values: CodeType) => {
    addCodeMutation.mutate({ ...values });
  };

  const handleCodeModify = (values: CodeType) => {
    updateCodeMutation.mutate({ ...values });
    handleClose();
  };

  useEffect(() => {
    if (data) setCodeListData(data?.response.payload);
  }, [data]);

  const isLoading = codeListLoading || authorityLoading;

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="세팅" breadcrumbItem="공통코드관리" />
        <div>
          <TableContainer
            columns={columns(handleEdit, authority)}
            isLoading={isLoading}
            data={codeListData || []}
            isGlobalFilter={true}
            isListOptionVisible
            isCheckbox={false}
            createButton={
              authority?.response.payload.menu.menuC && (
                <CreateButton
                  title="공통 코드 생성"
                  color="primary"
                  onClick={handleClick}
                />
              )
            }
          />
        </div>
      </Container>
      {show && (
        <CodeModal
          show={show}
          submitText={code ? '수정' : '생성'}
          item={code}
          onClose={handleClose}
          onSubmit={code ? handleCodeModify : handleCodeCreate}
        />
      )}
    </div>
  );
}

export default memo(CodeList);
