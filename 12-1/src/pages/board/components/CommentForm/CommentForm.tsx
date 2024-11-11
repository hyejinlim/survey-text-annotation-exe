import { Fragment, memo, useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import {
  fetchDeleteComment,
  fetchInsertComment,
} from '~/api/fetches/fetchBoard';
import TextArea from '~/components/shared/TextArea';
import * as styles from './styles';

const commentInitData = {
  commentId: 0,
  commentContents: '',
};

type CommentProps = {
  createdate: string;
  id: number;
  text: string;
  user: string;
  userId: number;
};

type Props = {
  data: CommentProps[];
  iid: string;
  refetch: any;
};
function CommentForm({ data, iid, refetch }: Props) {
  const [commentData, setCommentData] = useState(commentInitData);
  const [memberId, setMemberId] = useState('');
  const [editComment, setEditComment] = useState<boolean>(false);

  // 댓글 삭제
  const { mutate: deleteMutate } = useMutation(fetchDeleteComment, {
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: `성공적으로 삭제되었습니다.`,
        confirmButtonText: '확인',
      });
      refetch();
    },
  });

  // 뎃글 작성/수정
  const { mutate: createMutate } = useMutation(fetchInsertComment, {
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: `성공적으로 댓글이 작성되었습니다.`,
        confirmButtonText: '확인',
      });
      refetch();
      setCommentData(commentInitData);
      setEditComment(false);
    },
  });

  const handleChange = ({ value }: { value: string }) => {
    setCommentData((prev) => ({ ...prev, commentContents: value }));
  };

  const handleEdit = (comment: CommentProps) => {
    const { text, id } = comment;

    setCommentData(() => ({
      commentId: id,
      commentContents: text,
    }));
    setEditComment(true);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      icon: 'info',
      title: '삭제하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: `취소`,
    }).then(({ isConfirmed }) => {
      if (isConfirmed) deleteMutate(id);
    });
  };

  // 댓글 submit
  const handleSubmit = () => {
    const { commentId, commentContents } = commentData;

    if (commentData.commentContents.trim() === '') return;

    const commentObj = {
      commentId: commentId ?? 0,
      noticeId: iid,
      commentTitle: 'comment',
      commentContents,
    };
    createMutate(commentObj);
  };

  useEffect(() => {
    const user = window.localStorage.getItem('user');
    if (user) {
      const { memberNo } = JSON.parse(user);
      setMemberId(memberNo);
    }
  }, []);

  return (
    <Fragment>
      <div className="mb-2">
        <strong>댓글</strong>
      </div>
      <Row className="d-flex mb-5">
        <Col lg="11">
          <TextArea
            name="comment"
            minLength={2}
            value={commentData.commentContents}
            onChange={handleChange}
          />
        </Col>
        <Col>
          <Button
            color={editComment ? 'warning' : 'primary'}
            onClick={handleSubmit}
            block
          >
            {editComment ? '댓글수정' : '댓글달기'}
          </Button>
        </Col>
      </Row>
      <div className="mb-5">
        {data.map((comment: any) => {
          const { id, user, createdate, text, userId } = comment;
          return (
            <Card key={id}>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex gap-2 align-items-center">
                    <span>{user}</span>
                    <span css={styles.date}>{createdate}</span>
                  </div>
                  {memberId === userId && (
                    <div className="d-flex gap-2">
                      <span
                        css={styles.btn}
                        onClick={() => handleEdit(comment)}
                      >
                        수정
                      </span>
                      <span css={styles.btn} onClick={() => handleDelete(id)}>
                        삭제
                      </span>
                    </div>
                  )}
                </div>
                <div>{text}</div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </Fragment>
  );
}

export default memo(CommentForm);
