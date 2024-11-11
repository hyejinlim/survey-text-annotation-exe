import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import logo from '../../assets/images/logo-sm.svg';
import withRouter from '../../components/Common/withRouter';
import CarouselPage from '../AuthenticationInner/CarouselPage';

function Logout() {
  useEffect(() => {
    // 로그아웃 시 세션 스토리지에서 token 제거
    localStorage.removeItem('token');
  }, []);

  return (
    <div className="container-fluid p-0">
      <Container fluid>
        <Row className="row g-0">
          <Col xxl={3} lg={4} md={5}>
            <div className="auth-full-page-content d-flex p-sm-5 p-4">
              <div className="w-100">
                <div className="d-flex flex-column h-100">
                  <div className="mb-4 mb-md-5 text-center">
                    <Link to="index.html" className="d-block auth-logo">
                      <img src={logo} alt="" height="28" />
                      <span className="logo-txt">CMS & ANNOTATION</span>
                    </Link>
                  </div>
                  <div className="auth-content my-auto">
                    <div className="text-center">
                      <div className="avatar-xl mx-auto">
                        <div className="avatar-title bg-light-subtle text-primary h1 rounded-circle">
                          <i className="bx bxs-user"></i>
                        </div>
                      </div>

                      <div className="mt-4 pt-2">
                        <h5>로그아웃 되었습니다.</h5>
                        <p className="text-muted font-size-15">
                          이용해주셔서 감사합니다.
                        </p>
                        <div className="mt-4">
                          <Link
                            to="/dashboard/survey"
                            className="btn btn-primary w-100 waves-effect waves-light"
                          >
                            로그인
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 text-center">
                      <p className="text-muted mb-0">
                        회원가입하시겠습니까? &nbsp;
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

export default withRouter(Logout);
