import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';
const Login = () => {
  return (
    <Container fluid='md'>
      <Row>
        <Col>
          <Link to='/loginTeacher'>
            <Button>I'm a Teacher</Button>
          </Link>
        </Col>
        <Col>
          <Button>I'm a Students</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
