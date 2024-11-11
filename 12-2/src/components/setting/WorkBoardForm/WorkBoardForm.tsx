import { Fragment, memo, useMemo, useState } from 'react';
import { Button, Card, CardBody, Collapse } from 'reactstrap';
import { useQuery, useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import {
  fetchWorkBoard,
  fetchWorkBoardCreate,
  fetchWorkBoardDelete,
} from '~/api/workboard';
import WorkBoardModal from '~/components/modals/WorkBoardModal';
import Loading from '~/components/shared/Loading';
import TableContainer from '~/components/shared/TableContainer';
import TextField from '~/components/shared/TextField';
import { MENU0504, MENU0808 } from '~/constants/menu';
import { useCheckAuthorityQuery } from '~/hooks';
import columns from './constants';

type Props = {
  type: string;
};

function WorkBoardForm({ type }: Props) {
  const [userAccordionStates, setUserAccordionStates] = useState<{
    [memberNo: string]: boolean;
  }>({});
  const [show, setShow] = useState<boolean>(false);
  const [memberNo, setMemberNo] = useState('');
  const [workEdit, setWorkEdit] = useState(null);
  const [searchName, setSearchName] = useState('');

  const { data: authority, isLoading: authorityLoading } =
    useCheckAuthorityQuery(type === 'INSPECTION' ? MENU0808 : MENU0504);

  // 작업 할당
  const {
    data: workBoard,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['workboardData', type],
    queryFn: () =>
      fetchWorkBoard(type).then(({ response }) => response.payload),
  });

  const insertMutation = useMutation(fetchWorkBoardCreate, {
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: '정상적으로 추가/수정 되었습니다.',
        confirmButtonText: '확인',
      });
      refetch();
    },
  });

  const deleteMutation = useMutation(fetchWorkBoardDelete, {
    onSuccess: () => {
      Swal.fire({
        icon: 'error',
        title: '정상적으로 삭제되었습니다.',
        confirmButtonText: '확인',
      });
      refetch();
    },
  });

  const handleClick = (memberNo: string) => {
    setUserAccordionStates((prev) => ({
      ...prev,
      [memberNo]: !prev[memberNo],
    }));
  };

  /** 작업 할당  */
  const handleCreate = (memberNo: string) => {
    setMemberNo(memberNo);
    setShow(true);
  };

  const handleModalClose = () => {
    setShow(false);
  };

  const handleEdit = (workEdit: any) => {
    setWorkEdit(workEdit);
    setShow(true);
  };

  const handleDelete = (workboardId: string) => {
    Swal.fire({
      icon: 'info',
      title: '삭제하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: `취소`,
    }).then((result) => {
      const { isConfirmed } = result;
      if (isConfirmed) {
        deleteMutation.mutate(workboardId);
      }
    });
  };

  // 작업 할당 생성
  const handleWorkBoardCreate = (values: any) => {
    const { workboardStart, workboardEnd, contentsMediaCategory } = values;
    const data = {
      memberNo,
      workboardId: 0,
      workboardType: type,
      workboardStart,
      workboardEnd,
      contentsMediaCategory,
    };
    insertMutation.mutate(data);
  };

  // 작업 할당 수정
  const handleWorkBoardModify = (values: any) => {
    if (!workEdit) return null;
    const { memberNo, workboardId } = workEdit;
    const { contentsMediaCategory, workboardStart, workboardEnd } = values;
    const data = {
      memberNo,
      workboardId,
      workboardType: type,
      workboardStart,
      workboardEnd,
      contentsMediaCategory,
    };
    insertMutation.mutate(data);
  };

  const filteredData = useMemo(() => {
    if (!searchName) return workBoard || [];
    return (workBoard || []).filter(({ memberName }: any) =>
      memberName.includes(searchName)
    );
  }, [workBoard, searchName]);

  if (authorityLoading || isLoading) return <Loading />;
  return (
    <Fragment>
      <TextField
        placeholder="이름을 검색해주세요"
        value={searchName}
        onChange={({ value }: any) => setSearchName(value)}
        className="mb-2"
      />
      <Card>
        <CardBody>
          {filteredData.length > 0 ? (
            filteredData.map((work: any) => {
              const { memberNo, memberName, child } = work;
              return (
                <div className="accordion mb-1" id="accordion" key={memberNo}>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <button
                        className={clsx(
                          'accordion-button fw-medium bg-light-subtle',
                          { collapsed: !memberNo }
                        )}
                        type="button"
                        onClick={() => handleClick(memberNo)}
                      >
                        <div className="d-flex justify-content-start align-items-center gap-3 w-100">
                          <span>
                            <strong>{memberName}</strong> 작업 할당
                          </span>
                        </div>
                      </button>
                    </h2>
                    <Collapse
                      isOpen={userAccordionStates[memberNo]}
                      className="accordion-collapse"
                    >
                      <div className="accordion-body">
                        {authority?.response.payload.menu.menuC && (
                          <Button
                            color="info"
                            size="sm"
                            onClick={() => handleCreate(memberNo)}
                          >
                            추가+
                          </Button>
                        )}
                        <TableContainer
                          columns={columns({
                            handleEdit,
                            handleDelete,
                            authority,
                          })}
                          data={child}
                          defaultPageSize={10}
                          isCheckbox={false}
                          isPaginationOpen={false}
                        />
                      </div>
                    </Collapse>
                  </div>
                </div>
              );
            })
          ) : (
            <div>해당되는 이름이 없습니다.</div>
          )}
        </CardBody>
      </Card>

      {show && (
        <WorkBoardModal
          isOpen={show}
          onClose={handleModalClose}
          onSubmit={workEdit ? handleWorkBoardModify : handleWorkBoardCreate}
          item={workEdit}
        />
      )}
    </Fragment>
  );
}

export default memo(WorkBoardForm);
