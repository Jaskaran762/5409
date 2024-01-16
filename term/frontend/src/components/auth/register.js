// src/components/Login.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
const RegisterService = require("../../services/RegisterService");

const Register = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isButtonDisabled, setButt] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async() => {
    setButt(!email || !password || !name);
    await RegisterService.registerResponseData(name,email, password)
    .then(response => {
      if (response.status === 200) {
        navigate("/login");
      }
    }).catch(error=> {
      console.error(error);
    });
  }

  return (
    <Container className="mt-5">
      <Row className="align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        {/* Left Side: Image */}
        <Col md={6}>
          <img
            src="https://img.freepik.com/free-vector/abstract-art-concept-illustration_114360-5605.jpg" // Replace with your image URL
            alt="Login Image"
            className="img-fluid"
          />
        </Col>

        {/* Right Side: Login Form */}
        <Col md={6}>
          <h2>Register</h2>
          <Form>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Name" required onChange={(e) => setName(e.target.value)}/>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Email address" required onChange={(e) => setEmail(e.target.value)}/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" required onChange={(e) => {setPassword(e.target.value)}}/>
            </Form.Group>
            <br></br>
            <Button variant="primary" type="button" onClick={handleRegister} disabled={isButtonDisabled}>
              Register
            </Button>
        
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
