import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Button, CircularProgress, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { systemHttpService } from "../httpServices/systemHttpService";
import { appHttpService } from "../httpServices/appHttpService";
import { toast } from "react-toastify";

function SystemHomePage() {
  const [loading, setLoading] = useState(false);
  const [systemInfo, setSystemInfo] = useState(null);
  const getSystemInfo = async () => {
    setLoading(true);
    const { data, error } = await systemHttpService("/system-info");

    if (data) {
      setSystemInfo(data);
      console.log(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getSystemInfo();
  }, []);

  const regsiterComputer = () => {
    Swal.fire({
      icon: "question",
      title: "Register Computer",
      showDenyButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data, error } = await appHttpService.post(
          "computer/register",
          systemInfo
        );

        if (data) {
          toast.success(data);
        }

        if (error) {
          toast.error(error);
        }
      }
    });
  };
  return (
    <div>
      <div className="row m-0 candbg" style={{ height: "100vh" }}>
        <div className="col-lg-8  d-flex align-items-center text-white">
          <div className="container w-100 text-center">
            <img src={logo} className="App-logo" alt="logo" height={100} />

            <h1 className="text-white fw-700">JAMB TEST 2.0</h1>
            <h4 style={{ fontWeight: "lighter" }}>CLIENT CONSOLE</h4>
          </div>
        </div>
        <div className="col-lg-4 p-3 d-flex align-items-center">
          <div className="w-100 ">
            {/* <div className="mb-3">
              <Typography gutterBottom variant="h5" fontWeight={700}>
                Welcome to JAMB Test 2.0
              </Typography>
            </div>
            <Nav.Link as={Link} to={"/admin"} className="text-success">
              Login as admin
            </Nav.Link> */}
            <div className="mt-4">
              {loading && (
                <div className="text-center">
                  <CircularProgress color="success" size={20} />
                </div>
              )}
              {!loading && systemInfo && (
                <div className="p-3 rounded-3 shadow-sm text-light systemInfo">
                  <div className="mb-4">
                    <Typography variant="h6" fontWeight={300}>
                      SYSTEM INFORMATION
                    </Typography>
                    <hr />
                  </div>
                  <div className="mb-2">
                    <Typography variant="overline">
                      System Serial Number
                    </Typography>
                    <Typography fontWeight={700}>
                      {systemInfo.serialNumber}
                    </Typography>
                  </div>
                  <div className="mb-2">
                    <Typography variant="overline">MAC Address(es)</Typography>
                    <Typography fontWeight={700}>
                      {systemInfo.macAddresses.join(", ")}
                    </Typography>
                  </div>
                  <div className="mb-2">
                    <Typography variant="overline">RAM (MB)</Typography>
                    <Typography fontWeight={700}>{systemInfo.ramMB}</Typography>
                  </div>
                  <div className="mb-2">
                    <Typography variant="overline">Operating system</Typography>
                    <Typography fontWeight={700}>
                      {systemInfo.operatingSystem}
                    </Typography>
                  </div>
                  <div className="mb-2">
                    <Typography variant="overline">processor id</Typography>
                    <Typography fontWeight={700}>
                      {systemInfo.processorId}
                    </Typography>
                  </div>

                  <div className="mt-5">
                    <Button
                      variant="contained"
                      onClick={regsiterComputer}
                      sx={{
                        backgroundColor: "#FF8282",
                        "&:hover": {
                          backgroundColor: "#e67373", // slightly darker for hover
                        },
                      }}
                    >
                      Register as new computer
                    </Button>
                  </div>
                </div>
              )}

              {!loading && !systemInfo && (
                <div
                  className="p-3 rounded text-light"
                  style={{ backgroundColor: "#FF0066" }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    SYSTEM INFORMATION NOT FOUND
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemHomePage;
