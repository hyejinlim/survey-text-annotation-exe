import { memo } from 'react';
import { Container, Row, Col } from 'reactstrap';

function Footer() {
  return (
    <footer className="footer">
      <Container fluid={true}>
        <Row>
          <Col md={12} className="text-sm-end d-none d-sm-block">
            © {new Date().getFullYear()} DAYLUDENS All rights reserved
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default memo(Footer);
