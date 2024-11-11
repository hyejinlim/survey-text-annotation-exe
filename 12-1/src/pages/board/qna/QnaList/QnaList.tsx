import { useState, useCallback, memo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
  Button,
  Badge,
} from 'reactstrap';
import { useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import {
  fetchBoardState,
  fetchInsertQna,
  fetchQnaList,
} from '~/api/fetches/fetchBoard';
import QnaModal from '~/components/modals/QnaModal';
import Breadcrumb from '~/components/shared/Breadcrumb';
import Loading from '~/components/shared/Loading';
import { MENU0602 } from '~/constants/menu';
import { useCheckAuthorityQuery } from '~/hooks';
import * as styles from './styles';

function QnaList() {
  const navigate = useNavigate();
  const [show, setShow] = useState<boolean>(false);

  const {
    data: qnaList,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['qnaList'],
    queryFn: fetchQnaList,
  });

  const { data: authority, isLoading: authorityLoading } =
    useCheckAuthorityQuery(MENU0602);

  const postBoardMutation = useMutation(fetchInsertQna, {
    onSuccess: () => {
      return Swal.fire({
        icon: 'success',
        title: ` 건의사항이 생성/수정 되었습니다.`,
        confirmButtonText: '확인',
      }).then(() => {
        refetch();
      });
    },
  });

  const patchBoardMutation = useMutation(fetchBoardState, {
    onSuccess: () => {
      refetch();
    },
  });

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    // 아이템 위치 변경 로직
    const sourcePart = qnaList?.response.payload.find(
      ({ id }: any) => id.toString() === source.droppableId
    );
    const destinationPart = qnaList?.response.payload.find(
      ({ id }: any) => id.toString() === destination.droppableId
    );

    if (sourcePart?.items instanceof Array) {
      // 배열인지 확인
      const [movedItem] = sourcePart.items.splice(source.index, 1);
      if (destinationPart?.items instanceof Array) {
        // 배열인지 확인
        destinationPart.items.splice(destination.index, 0, movedItem);
      }
      const movedItemId = movedItem.id;
      const destinationPartId = destinationPart.id;
      const data = {
        noticeId: movedItemId,
        noticeStep: destinationPartId,
      };

      patchBoardMutation.mutate(data);
    }
  };

  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  const handleCodeCreate = useCallback(() => {
    navigate('/board/qna/form');
    setShow(true);
  }, []);

  const handleCreate = (values: any) => {
    const { title, text } = values;
    const newData = {
      noticeId: 0,
      noticeTitle: title,
      noticeContents: text,
    };
    postBoardMutation.mutate(newData);
  };

  const handleClick = (id: string) => {
    navigate(`/board/qna/${id}`);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="게시판" breadcrumbItem="QnA" />
        {isLoading || authorityLoading ? (
          <Loading />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Row>
              {qnaList?.response.payload.map((part: any) => {
                const { id, title, items } = part;
                return (
                  <Col key={id.toString()} lg="4">
                    <Card>
                      <CardHeader className="bg-light-subtle d-flex justify-content-between align-items-center">
                        <h5>{title}</h5>
                        {authority?.response.payload.menu.menuC && (
                          <Form>
                            {title === '신규' && (
                              <Button
                                color="info"
                                size="sm"
                                onClick={handleCodeCreate}
                              >
                                추가
                              </Button>
                            )}
                          </Form>
                        )}
                      </CardHeader>
                      <CardBody>
                        <Droppable droppableId={id.toString()}>
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {items.map((item: any, index: any) => (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id.toString()}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      onClick={() => handleClick(item.id)}
                                      className="d-flex align-items-center mb-3 justify-content-between"
                                      css={styles.item}
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...provided.draggableProps.style, // 이전 스타일 유지
                                        backgroundColor: snapshot.isDragging
                                          ? '#e0e6f8'
                                          : 'white', // 드래그 중일 때 파란색 배경색
                                      }}
                                    >
                                      <div className="d-flex flex-column align-items-start  m-2">
                                        <Badge
                                          color={
                                            item.category.value ===
                                            'noticeCategory02'
                                              ? 'success'
                                              : item.category.value ===
                                                'noticeCategory01'
                                              ? 'warning'
                                              : 'primary' // 디폴트값 설정
                                          }
                                          className="mb-2"
                                        >
                                          {item.category.label}
                                        </Badge>
                                        <span className="mb-2">
                                          <strong>{item.title}</strong>
                                        </span>
                                        <span>{item.createdate}</span>
                                      </div>
                                      <div className="btn-group" role="group" />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </CardBody>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </DragDropContext>
        )}
      </Container>
      <QnaModal
        show={show}
        onClose={handleClose}
        onCreate={handleCreate}
        submitText="생성"
      />
    </div>
  );
}

export default memo(QnaList);
