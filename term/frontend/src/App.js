// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/header/header";
import PageRoutes from "./routes/route";


function App() {
  return (
    <Router>
      <Container style={{ maxWidth: "100vm", padding: 0 }}>
        <Header/>
        <PageRoutes/>
      </Container>
    </Router>
  );
}

export default App;
