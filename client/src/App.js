import React from "react";
import "./App.css"; // Import your app-specific CSS file if you have one

import TGTable from "./components/TGTable";
import Schedule from "./components/Schedule";
import HomePage from "./components/HomePage";
import ReqTimeoutTable from "./components/ReqTimeoutTable";

import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  // Get the isChecking, startChecking, and stopChecking from StateButton
  // const {
  //   // Start/Stop
  //   isStartChecking,
  //   startChecking,
  //   stopChecking,
  // } = PriceChecker();

  return (
    <Router>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Nav className="me-auto">
            <Navbar.Brand as={Link} to="/">
              RO Spider
            </Navbar.Brand>
            {/* Home */}
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {/* TG */}
            <Nav.Link as={Link} to="/tg">
              TG
            </Nav.Link>
            {/* Schedule */}
            <Nav.Link as={Link} to="/schedule">
              Schedule
            </Nav.Link>
            <Nav.Link as={Link} to="/req-timeout">
              Req-Timeout
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tg" element={<TGTable />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/req-timeout" element={<ReqTimeoutTable />} />
      </Routes>
    </Router>
  );
}

export default App;
