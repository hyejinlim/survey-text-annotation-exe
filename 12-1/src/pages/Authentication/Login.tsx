import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Container, Form, Label, FormFeedback } from 'reactstrap';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { fetchLogin } from '~/api/authentication/authentication';
import TextField from '~/components/shared/TextField';
import { getLoginFormSchema } from '~/validations/authentication/loginFormValidations';
import logo from '../../assets/images/logo-sm.svg';
import withRouter from '../../components/Common/withRouter';
import CarouselPage from '../AuthenticationInner/CarouselPage';

function Login() {
  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: getLoginFormSchema() });

  const navigate = useNavigate();
  const loginMutation = useMutation(fetchLogin, {
    onSuccess: (data) => {
      if (data.response.payload.result === 'success') {
        window.localStorage.setItem(
          'user',
          JSON.stringify(data.response.payload.member)
        );
        return navigate('/dashboard/survey');
      } else {
        Swal.fire({
          icon: 'error',
          title: `${data.response.payload.message}`,
          confirmButtonText: '확인',
        });
      }
    },
    onError: (err: any) => {
      Swal.fire({
        icon: 'error',
        title: `${err.response.payload.payload.message}`,
        confirmButtonText: '확인',
      });
    },
  });

  const handleClick = (values: any) => {
    if (values) {
      const { id, password } = values;
      const loginUser = {
        memberId: id,
        memberPassword: password,
      };

      loginMutation.mutate(loginUser);
    }
  };

  const handleChange = ({ name, value }: any) => {
    setValue(name, value, { shouldValidate: true });
  };

  return (
    <div className="auth-page">
      <Container fluid className="p-0">
        <Row className="g-0">
          <Col lg={4} md={5} className="col-xxl-3">
            <div className="auth-full-page-content d-flex p-sm-5 p-4">
              <div className="w-100">
                <div className="d-flex flex-column h-100">
                  <div className="mb-4 mb-md-5 text-center">
                    <div className="d-block auth-logo">
                      <img src={logo} alt="" height="28" />
                      <span className="logo-txt">CMS & ANNOTATION</span>
                    </div>
                  </div>
                  <div className="auth-content my-auto">
                    <div className="text-center">
                      <h5 className="mb-0">로그인</h5>
                    </div>
                    <Form className="custom-form mt-4 pt-2">
                      <div className="mb-3">
                        <Label className="form-label">아이디</Label>
                        <TextField
                          id="id"
                          name="id"
                          placeholder="아이디를 입력해주세요"
                          type="email"
                          invalid={!!errors?.id}
                          onChange={handleChange}
                        />
                        {!!errors?.id && (
                          <FormFeedback type="invalid">
                            {errors?.id?.message}
                          </FormFeedback>
                        )}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">비밀번호</Label>
                        <TextField
                          name="password"
                          type="password"
                          invalid={!!errors?.password}
                          placeholder="비밀번호를 입력해주세요"
                          onChange={handleChange}
                        />
                        {!!errors?.password && (
                          <FormFeedback type="invalid">
                            {errors?.password?.message}
                          </FormFeedback>
                        )}
                      </div>

                      <div className="row mb-4">
                        <div className="col">
                          <div className="mt-3 d-grid">
                            <button
                              className="btn btn-primary btn-block"
                              type="submit"
                              onClick={handleSubmit(handleClick)}
                            >
                              {loginMutation.isLoading ? (
                                <>
                                  <div
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                  ></div>
                                  <span>로그인 중입니다</span>
                                </>
                              ) : (
                                <span>로그인</span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </Form>
                    <div className="mt-5 text-center">
                      <p className="text-muted mb-0">
                        회원가입을 하시겠습니까? &nbsp;
                        <Link
                          to="/register"
                          className="text-primary fw-semibold"
                        >
                          회원가입
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <CarouselPage />
        </Row>
      </Container>
    </div>
  );
}

export default withRouter(Login);
