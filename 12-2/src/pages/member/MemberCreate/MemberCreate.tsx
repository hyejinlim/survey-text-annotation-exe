import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import Swal from 'sweetalert2';
import Breadcrumb from '~/components/shared/Breadcrumb';
import { useInsertMember } from '~/hooks';
import MemberForm from '../MemberForm';

function MemberCreate() {
  const navigate = useNavigate();
  const { mutate, isLoading } = useInsertMember();

  const handleBack = () => navigate(-1);
  const handleCreateClick = (values: any) => {
    const { group, id, isAlarm, memo, name, password, state } = values;
    const data = {
      memberNo: 0,
      memberId: id,
      memberPassword: password,
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
            title: '회원 가입이 성공했습니다',
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
          text: '회원 가입이 실패했습니다.',
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
        <Breadcrumb title="회원" breadcrumbItem="회원정보생성" />
        <MemberForm
          submitText="생성"
          isLoading={isLoading}
          onBack={handleBack}
          onSubmit={handleCreateClick}
        />
      </Container>
    </div>
  );
}
export default memo(MemberCreate);
