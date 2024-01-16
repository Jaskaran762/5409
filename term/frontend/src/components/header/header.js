// src/components/Header.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Button,
  Form,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../redux/userSlice";
import { LinkContainer } from 'react-router-bootstrap';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigateToLogin = () => {
    navigate("/login");
  };

  const user = useSelector(selectUser);
  console.log(user);
  const check = () => {
    return user == null || user.user == null;
  };
  console.log(check());
  const handleLogout = () => {
    dispatch(setUserDetails({ user: null }));
    navigateToLogin();
    
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand href="#">SnapSearch</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
          </Nav>
          <Nav>
            { !(check()) ? (
              // User is logged in, show logout button
              <>
                <Nav className="ms-auto">
                  <LinkContainer to="/album">
                    <Nav.Link>Dashboard</Nav.Link>
                  </LinkContainer>
                </Nav>

                <Nav className="ms-auto">
                  {/*<LinkContainer to='/profile'>*/}
                  {/*    <Nav.Link>*/}
                  {/*        <i className="fas fa-user"></i> Profile*/}
                  {/*    </Nav.Link>*/}
                  {/*</LinkContainer>*/}

                  <Nav.Link onClick={handleLogout}>
                    <i className="fas fa-sign-out"></i> Sign Out
                  </Nav.Link>
                </Nav>
              </>
            ) : (
              // User is not logged in, show login and register buttons
              <>
                <Nav className="ms-auto">
                  <LinkContainer to="/login">
                    <Nav.Link>
                      Sign in <i className="fas fa-sign-in"></i>
                    </Nav.Link>
                  </LinkContainer>
                </Nav>
                <Nav className="ms-auto">
                  <LinkContainer to="/register">
                    <Nav.Link>
                      Register <i className="fas fa-sign-in"></i>
                    </Nav.Link>
                  </LinkContainer>
                </Nav>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
