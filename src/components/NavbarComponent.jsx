import Container from "react-bootstrap/Container";
import { Navbar, Nav } from "react-bootstrap";
import { Button, Typography } from "@mui/material";
import { useAppUser } from "../contexts/AppUserContext";
import { Comment, Devices, Home, Logout, Speed } from "@mui/icons-material";
import { appHttpService } from "../httpServices/appHttpService";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import appLogo from "../assets/logo.png";
//import "./NavbarComponent.css"; // 👈 import the animation CSS

function NavbarComponent() {
  const { user } = useAppUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { data } = await appHttpService("auth/logout");
      if (data) {
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  };

  const links = [
    { text: "Home", path: "/admin", icon: <Home fontSize="small" /> },
    {
      text: "Register Computers",
      path: "/admin/registercomputers",
      icon: <Devices fontSize="small" />,
    },
    {
      text: "Network Test",
      path: "/admin/networktest",
      icon: <Speed fontSize="small" />,
    },
    {
      text: "Infractions",
      path: "/admin/infractions",
      icon: <Comment fontSize="small" />,
    },
  ];

  return (
    <Navbar expand="lg" className="bg-body-tertiary shadow-sm">
      <Container>
        <Navbar.Brand
          onClick={() =>
            navigate(user && user.role === "admin" ? "/admin/" : "/")
          }
          style={{ cursor: "pointer" }}
        >
          <div className="d-flex align-items-center">
            <img
              alt=""
              src={appLogo}
              height="30"
              className="d-inline-block align-top me-2"
            />
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>
              JAMB TEST
            </span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto align-items-center nav-links">
            {links.map((c, i) => {
              const isActive = location.pathname === c.path;
              return (
                <Nav.Link
                  key={i}
                  as={Link}
                  to={c.path}
                  className={`nav-item-link ${isActive ? "active-link" : ""}`}
                >
                  <div className="d-flex align-items-center gap-1">
                    {c.icon}
                    <Typography variant="body2">{c.text}</Typography>
                  </div>
                </Nav.Link>
              );
            })}
          </Nav>

          <Nav className="ms-auto">
            {user ? (
              <Button
                onClick={handleLogout}
                disabled={loading}
                color="error"
                endIcon={<Logout />}
                sx={{ textTransform: "capitalize" }}
              >
                <Typography variant="body2">Logout</Typography>
              </Button>
            ) : (
              <>
                <Nav.Link as={Link} to="/">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/login">
                  Admin-Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
