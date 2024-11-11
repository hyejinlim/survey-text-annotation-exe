import { memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { fetchMemberInfo } from '~/api/fetches/fetchMember';
import Breadcrumb from '~/components/shared/Breadcrumb';
import { useInsertMember } from '~/hooks';
import MemberForm from '../MemberForm';

function MemberModify() {
  const { mid } = useParams();
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);
  const { mutate, isLoading } = useInsertMember();

  const { data: memberInfo } = useQuery(['memberInfo', mid], () =>
    fetchMemberInfo(mid)
  );

  const handleModifyClick = (values: any) => {
    const { group, id, isAlarm, memo, name, password, state } = values;
    const data = {
      memberNo: +mid!,
      memberPassword: password === undefined ? '' : password,
      memberId: id,
      groupCode: group,
      memberStatus: state,
      memberMemo: memo,
      memberName: name,
      memberPushTF: isAlarm,
    };

    mutate(data, {
      onSuccess: (data) => {
        const { result } = data.response.payload;
        if (result === 'success') {
          Swal.fire({
            icon: 'success',
            title: '회원 정보 수정이 성공했습니다',
            confirmButtonText: '확인',
          }).then(() => {
            navigate('/member');
          });

          return;
        } else {
          Swal.fire({
            icon: 'error',
            title: data?.response.payload.message,
            confirmButtonText: '확인',
          });
        }
      },
      onError: () => {
        Swal.fire({
          icon: 'success',
          text: '회원 정보 수정이 실패했습니다.',
          confirmButtonText: '확인',
        }).then(() => {
          navigate('/member');
        });
      },
    });
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="회원" breadcrumbItem="회원정보수정" />
        <MemberForm
          item={memberInfo?.response.payload}
          submitText="수정"
          isLoading={isLoading}
          onBack={handleBack}
          onSubmit={handleModifyClick}
        />
      </Container>
    </div>
  );
}

export default memo(MemberModify);
