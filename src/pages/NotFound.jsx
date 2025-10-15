import { Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useAppUser } from "../contexts/AppUserContext";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const { user } = useAppUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/admin/dashboard");
    }

    if (user && user.role === "candidate") {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <div
        style={{ height: "80vh" }}
        className="d-flex align-items-center justify-content-center"
      >
        <Stack direction={"row"}>
          <div>
            <Typography variant="h3" fontWeight={700}>
              404
            </Typography>
          </div>
          <div className="border-start d-flex align-items-center p-2 ms-2">
            <Typography color={"GrayText"}>Page not found</Typography>
          </div>
        </Stack>
      </div>
    </div>
  );
}

export default NotFound;
