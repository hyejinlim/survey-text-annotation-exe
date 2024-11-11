import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Container, Label, Form, FormFeedback } from 'reactstrap';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchRegister } from '~/api/authentication/authentication';
import { fetchGroupList } from '~/api/setting/group';
import Selectbox from '~/components/shared/Selectbox';
import TextField from '~/components/shared/TextField';
import { getRegusterFormSchema } from '~/validations/authentication/registerFormValidation';
import logo from '../../assets/images/logo-sm.svg';
import CarouselPage from '../AuthenticationInner/CarouselPage';

function Register() {
  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: getRegusterFormSchema() });

  const navigate = useNavigate();

  const registerMutation = useMutation(fetchRegister, {
    onSuccess: (data) => {
      navigate('/login');
    },
  });

  const handleChange = ({ name, value }: any) => {
    setValue(name, value, { shouldValidate: true });
  };

  const handleClick = (values: any) => {
    if (values) {
      const { id, name, password, largeGroup } = values;
      const newUser = {
        memberId: id,
        memberPassword: password,
        memberName: name,
        groupCode: largeGroup,
      };

      registerMutation.mutate(newUser);
    }
  };

  const { data: getAllLargeGroupData } = useQuery({
    queryKey: ['largeGroup'],
    queryFn: () => fetchGroupList(),
  });

  return (
    <Fragment>
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
                        <h2 className="mb-0">회원가입</h2>
                      </div>
                      <Form className="needs-validation custom-form mt-4 pt-2">
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
                          <Label className="form-label">이름</Label>
                          <TextField
                            name="name"
                            type="text"
                            invalid={!!errors?.name}
                            placeholder="이름을 입력해주세요"
                            onChange={handleChange}
                          />
                          {!!errors?.name && (
                            <FormFeedback type="invalid">
                              {errors?.name?.message}
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

                        {getAllLargeGroupData ? (
                          <div className="mb-3">
                            <Label className="form-label">소속</Label>
                            <Selectbox
                              placeholder="소속"
                              name="largeGroup"
                              onChange={handleChange}
                              invalid={!!errors?.largeGroup}
                              items={getAllLargeGroupData.response.payload}
                              className="form-select bg-light bg-opacity-25"
                            ></Selectbox>
                            {!!errors?.largeGroup && (
                              <FormFeedback type="invalid">
                                {errors?.largeGroup?.message}
                              </FormFeedback>
                            )}
                          </div>
                        ) : null}

                        <div className="mb-4"></div>
                        <div className="mb-3">
                          <button
                            className="btn btn-primary w-100 waves-effect waves-light"
                            type="submit"
                            onClick={handleSubmit(handleClick)}
                          >
                            {registerMutation.isLoading ? (
                              <>
                                <div
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                ></div>
                                <span>회원가입 중입니다</span>
                              </>
                            ) : (
                              <span>회원가입</span>
                            )}
                          </button>
                        </div>
                      </Form>

                      <div className="mt-5 text-center">
                        <p className="text-muted mb-0">
                          이미 가입을 하셨나요? &nbsp;
                          <Link
                            to="/login"
                            className="text-primary fw-semibold"
                          >
                            로그인
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
    </Fragment>
  );
}

export default Register;
