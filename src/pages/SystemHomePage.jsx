import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Button, CircularProgress, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { systemHttpService } from "../httpServices/systemHttpService";
import { appHttpService } from "../httpServices/appHttpService";
import { toast } from "react-toastify";
import {
  DesktopMac,
  DesktopAccessDisabled,
  DeveloperBoardOff,
  MobiledataOff,
  CloudOff,
  OutlinedFlag,
  Done,
} from "@mui/icons-material";
import { instructions } from "./instructionsData";
import { useNavigate } from "react-router-dom";

const errorMessages = {
  noCentre: "No centre found, contact administrator",
  noComputer: "Computer not yet registered",
  noActiveTest: "There is no active network test",
  computerFlagged: "This computer has been flagged for an infraction",
  notUploaded: "This computer is not yet registered on the JAMB test network",
  alreadyTested: "This computer has already been tested",
};

function SystemHomePage() {
  const [loading, setLoading] = useState(false);
  const [systemInfo, setSystemInfo] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [errorIcon, setErrorIcon] = useState(null);

  const navigate = useNavigate();
  const getSystemInfo = async () => {
    setLoading(true);
    const { data, error } = await systemHttpService("/system-info");

    if (data) {
      setSystemInfo(data);
    }

    if (error) {
      //toast.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Step 1: Fetch system info once
    getSystemInfo();
    beginNetworkTest();
  }, []);

  useEffect(() => {
    // Step 2: Only start polling if systemInfo is available
    if (!systemInfo) return;
    const interval = setInterval(() => {
      beginNetworkTest();
    }, 10_000);
    return () => clearInterval(interval);
  }, [systemInfo]);
  const regsiterComputer = () => {
    Swal.fire({
      icon: "question",
      title: "Register Computer",
      showDenyButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setRegistering(true);
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
        setRegistering(false);
      }
    });
  };

  const beginNetworkTest = async () => {
    if (systemInfo) {
      const { data, error } = await appHttpService.post(
        "networktest/begintest",
        systemInfo
      );

      if (data) {
        navigate(
          `/networktest?networktest=${data.networkTest}&computer=${data.computer}`
        );
        console.log(data);
      }

      if (error) {
        error === errorMessages.noCentre &&
          setErrorIcon(<DeveloperBoardOff sx={{ fontSize: 100 }} />);

        error === errorMessages.noComputer &&
          setErrorIcon(<DesktopAccessDisabled sx={{ fontSize: 100 }} />);

        error === errorMessages.noActiveTest &&
          setErrorIcon(<MobiledataOff sx={{ fontSize: 100 }} />);

        error === errorMessages.notUploaded &&
          setErrorIcon(<CloudOff sx={{ fontSize: 100 }} />);

        error === errorMessages.computerFlagged &&
          setErrorIcon(<OutlinedFlag sx={{ fontSize: 100 }} />);

        error === errorMessages.alreadyTested &&
          setErrorIcon(<Done sx={{ fontSize: 100 }} />);

        setError(error);
      }
    }
  };

  return (
    <div>
      <div className="mt-5 text-center">
        <img src={logo} className="mb-0" alt="logo" height={100} />

        <h4 style={{ fontWeight: 700 }}>JAMB TEST 2.0</h4>
        <h6 style={{ fontWeight: "lighter" }}>
          CLIENT CONSOLE{" "}
          {loading && <CircularProgress size={15} color="GrayText" />}
        </h6>
      </div>

      <div className="mt-4">
        <div className="row m-0 d-flex justify-content-center">
          <div
            className="col-lg-4   text-light p-3 m-1"
            style={{ backgroundColor: "#88AB8E" }}
          >
            <Typography textAlign={"center"} variant="h6" fontWeight={700}>
              System Information
            </Typography>
            <div className="mb-4">
              <hr />
            </div>

            {!loading && !systemInfo && (
              <div className="text-center">
                <div className="mb-3">
                  <DesktopAccessDisabled sx={{ fontSize: 100 }} />
                  <Typography>No system information found.</Typography>
                </div>
                <div className="mb-5">
                  <Typography>
                    To retrieve system information, kindly ensure the client
                    service is running on this machine.
                  </Typography>
                </div>
                <div>
                  <Button
                    onClick={getSystemInfo}
                    endIcon={<DesktopMac sx={{ mr: 1 }} />}
                    color="inherit"
                    variant="outlined"
                  >
                    Retrieve Information
                  </Button>
                </div>
              </div>
            )}
            {!loading && systemInfo && (
              <div>
                <div className="mb-3">
                  <Typography>
                    Manufacturer: <b>{systemInfo.manufacturer}</b>
                  </Typography>
                </div>
                <div className="mb-3">
                  <Typography>
                    Model: <b>{systemInfo.model}</b>
                  </Typography>
                </div>
                <div className="mb-3">
                  <Typography>
                    System Serial Number: <b>{systemInfo.serialNumber}</b>
                  </Typography>
                </div>
                <div className="mb-3">
                  <Typography>
                    MAC Address(es): <b>{systemInfo.macAddresses.join(", ")}</b>
                  </Typography>
                </div>
                <div className="mb-3">
                  <Typography>
                    RAM: <b>{(systemInfo.ramMB / 1024).toFixed(2)} GB</b>
                  </Typography>
                </div>
                <div className="mb-3">
                  <Typography>
                    Operating system: <b>{systemInfo.operatingSystem}</b>
                  </Typography>
                </div>
                <div className="mb-3">
                  <Typography>
                    Processor ID: <b>{systemInfo.processorId}</b>
                  </Typography>
                </div>
                <div className="mb-3">
                  <Typography>
                    CPU Model: <b>{systemInfo.cpuModel}</b>
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
                    endIcon={<DesktopMac />}
                    loadingPosition="end"
                    loading={registering}
                  >
                    Register as new computer
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div
            className="col-lg-3  text-white p-3 m-1"
            style={{ backgroundColor: "#DC8686" }}
          >
            <Typography textAlign={"center"} variant="h6" fontWeight={700}>
              Important Information
            </Typography>
            <div className="mb-4">
              <hr />
            </div>
            <div>
              {instructions.map((c, i) => (
                <Typography key={i} className="mb-4">
                  {i + 1}. {c}
                </Typography>
              ))}
            </div>
          </div>

          <div
            className="col-lg-3 p-3 m-1 text-muted"
            style={{ backgroundColor: "#EEE7DA" }}
          >
            <div className="text-center">
              <Typography variant="h6" fontWeight={700}>
                Network Test
              </Typography>
            </div>
            <div className="mb-4">
              <hr />
            </div>
            <div className="text-center bounce-fade">
              {errorIcon && errorIcon}
              {error && <Typography className="mt-5">{error}</Typography>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemHomePage;
