import { ArrowBack } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import React, { useEffect } from "react";

function NetworkTestConcluded() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 10_000);
  }, []);
  return (
    <div>
      <div className="container mt-5">
        <div className="text-center">
          <Typography
            color="GrayText"
            gutterBottom
            variant="h2"
            fontWeight={700}
          >
            JAMB TEST CONCLUDED
          </Typography>
          <Button
            onClick={() => navigate("/")}
            color="success"
            startIcon={<ArrowBack />}
          >
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NetworkTestConcluded;
