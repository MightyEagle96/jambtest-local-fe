import { Typography, Box, CircularProgress } from "@mui/material";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAppUser } from "../contexts/AppUserContext";

function LoadingPage() {
  //  const navigate = useNavigate();
  const { user } = useAppUser();

  useEffect(() => {
    // if (user.role === "admin") {
    //   navigate(`/admin/dashboard`);
    // } else {
    //   navigate(`/`);
    // }
  }, []);
  return (
    <div
      style={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="text-center floating-logo">
        <img src={logo} className="" alt="FCSC Logo" width="120" height="100" />

        <div className="mt-2">
          <Typography variant="h6">JAMB TEST</Typography>

          {/* Circular Progress with gradient */}
          <Box sx={{ position: "relative", display: "inline-flex", mt: 2 }}>
            <CircularProgress
              size={20}
              thickness={3}
              sx={{
                "svg circle": {
                  stroke: "url(#gradientColors)",
                },
              }}
            />
            {/* Gradient definition */}
            <svg width="0" height="0">
              <defs>
                <linearGradient
                  id="gradientColors"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#124170" />
                  <stop offset="50%" stopColor="#26667F" />
                  <stop offset="100%" stopColor="#67C090" />
                </linearGradient>
              </defs>
            </svg>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default LoadingPage;
