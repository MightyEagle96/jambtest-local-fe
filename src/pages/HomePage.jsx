import React, { use, useState } from "react";
import logo from "../assets/logo.png";
import { Button, TextField, Typography } from "@mui/material";

import { toast } from "react-toastify";
import { Login } from "@mui/icons-material";
import { appHttpService } from "../httpServices/appHttpService";
function HomePage() {
  const [ReferenceNumber, setReferenceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const getData = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await appHttpService.post("auth/login", {
      ReferenceNumber,
    });

    if (data) {
      window.location.reload();
    }

    if (error) {
      toast.error(error);
    }
    setLoading(false);
  };
  return (
    <div>
      <div className="row m-0" style={{ height: "100vh" }}>
        <div className="col-lg-8 homepagebg d-flex align-items-center text-white">
          <div className="container w-100 text-center">
            <img src={logo} className="App-logo" alt="logo" height={100} />

            <h1 className="text-white fw-700">JAMB TEST 2.0</h1>
            <h4 style={{ fontWeight: "lighter" }}>ADMIN MANAGEMENT CONSOLE</h4>
          </div>
        </div>
        <div className="col-lg-4 p-3 d-flex align-items-center">
          <div className="w-100">
            <div>
              <div className="mb-5">
                <Typography gutterBottom variant="h5" fontWeight={700}>
                  Welcome to JAMB Test 2.0
                </Typography>
                <Typography color="textSecondary">
                  Kindly login with your centre's reference number
                </Typography>
              </div>
              <form onSubmit={getData}>
                <div className="mb-3">
                  <TextField
                    fullWidth
                    label="Centre reference number"
                    onChange={(e) => setReferenceNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Button
                    loading={loading}
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="success"
                    endIcon={<Login />}
                  >
                    Login
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
