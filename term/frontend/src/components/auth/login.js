// src/components/Login.js
import React from "react";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../redux/userSlice";
const LoginService = require("../../services/LoginService");

const Login = () => {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonDisabled, setButt] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dispatchUserDetails = (userDetails) => {
    console.log("calling fetch userDetails!");
    dispatch(
      setUserDetails({
        user: userDetails, 
      })
    );
  };

  const handleRegister = (e) => {
    navigate("/register");
  };
  const handleLogin = async() => {
    setButt(!email || !password);
    await LoginService.loginResponseData(email, password)
    .then(response => {
      if (response.status === 200) {
        dispatchUserDetails(response.data.id);
        navigate("/album");
      }
    }).catch(error=> {
      console.error(error);
    });
  };


  return (
    <Container className="mt-5">
      <Row
        className="align-items-center justify-content-center"
        style={{ minHeight: "80vh" }}
      >
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
          <h2>Login</h2>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" required onChange={(e) => setEmail(e.target.value)}/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)}/>
            </Form.Group>
            <br></br>
            <Button variant="primary" type="button" onClick={handleLogin} disabled={isButtonDisabled}>
              Login
            </Button>
            <span>&nbsp;&nbsp;or &nbsp;</span>
            <Button variant="primary" type="button"  onClick={handleRegister}>
              Click to Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
