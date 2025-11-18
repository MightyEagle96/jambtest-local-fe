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
import { useDispatch } from "react-redux";
import { setDuration } from "../redux/durationSlice";
import { setNetworkTestDetail } from "../redux/networkTestDetail";
import { appVersion } from "../routes/appVersion";

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
  const [centreDetail, setCentreDetail] = useState(null);
  const [testStarted, setTestStarted] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch centre details
  const getCentreDetail = async () => {
    try {
      const { data } = await appHttpService.get("networktest/centredetail");
      if (data) setCentreDetail(data);
    } catch (err) {
      console.error("Failed to get centre detail:", err);
    }
  };

  // Fetch system information
  const getSystemInfo = async () => {
    try {
      setLoading(true);
      const { data } = await systemHttpService("/system-info");
      if (data) setSystemInfo(data);
    } catch (err) {
      console.error("Failed to fetch system info:", err);
    } finally {
      setLoading(false);
    }
  };

  // Register computer prompt
  const registerComputer = () => {
    Swal.fire({
      icon: "question",
      title: "Register Computer",
      text: "Do you want to register this computer?",
      showDenyButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        setRegistering(true);
        const { data } = await appHttpService.post(
          "computer/register",
          systemInfo
        );
        if (data) toast.success(data);
      } catch (err) {
        toast.error(err?.message || "Error registering computer");
      } finally {
        setRegistering(false);
      }
    });
  };

  // Begin network test
  const beginNetworkTest = async () => {
    if (!systemInfo || testStarted) return;

    try {
      const { data, error } = await appHttpService.post(
        "networktest/begintest",
        systemInfo
      );

      if (data) {
        setTestStarted(true);
        dispatch(setDuration(0));
        dispatch(setNetworkTestDetail(null));

        window.location.assign(
          `/networktest?networktest=${data.networkTest}&computer=${data.computer}`
        );
      }

      if (error) {
        const message =
          typeof error === "string" ? error : error?.message || "Unknown error";
        setError(message);

        // Select corresponding icon
        const iconMap = {
          [errorMessages.noCentre]: (
            <DeveloperBoardOff sx={{ fontSize: 100 }} />
          ),
          [errorMessages.noComputer]: (
            <DesktopAccessDisabled sx={{ fontSize: 100 }} />
          ),
          [errorMessages.noActiveTest]: (
            <MobiledataOff sx={{ fontSize: 100 }} />
          ),
          [errorMessages.notUploaded]: <CloudOff sx={{ fontSize: 100 }} />,
          [errorMessages.computerFlagged]: (
            <OutlinedFlag sx={{ fontSize: 100 }} />
          ),
          [errorMessages.alreadyTested]: <Done sx={{ fontSize: 100 }} />,
        };

        setErrorIcon(iconMap[message] || null);
      }
    } catch (err) {
      console.error("Network test failed:", err);
      setError("Failed to connect to network test service");
    }
  };

  // Fetch system info once on mount
  useEffect(() => {
    getSystemInfo();
  }, []);

  // Once systemInfo is ready, get centre and start network test
  useEffect(() => {
    if (systemInfo) {
      getCentreDetail();
      beginNetworkTest();
    }
  }, [systemInfo]);

  // Poll for updates every 10 seconds (after system info exists)
  useEffect(() => {
    if (!systemInfo) return;

    const pollNetwork = setInterval(() => {
      beginNetworkTest();
      getCentreDetail();
    }, 10_000);

    return () => clearInterval(pollNetwork);
  }, [!!systemInfo]);

  return (
    <div>
      <div className="row m-0 mt-5 d-flex align-items-center justify-content-center">
        <div className="col-lg-3 text-center">
          <img src={logo} className="mb-0" alt="logo" height={100} />
          <h4 style={{ fontWeight: 700 }}>JAMB TEST 2.0</h4>
          <h6 style={{ fontWeight: "lighter" }}>
            {loading && <CircularProgress size={15} color="inherit" />}
          </h6>
        </div>
        <div className="col-lg-6">
          {centreDetail && (
            <div className="alert alert-success border-0">
              <Typography textTransform={"uppercase"}>
                {centreDetail.CentreName}
              </Typography>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="row m-0 d-flex justify-content-center">
          {/* System Info Section */}
          <div
            className="col-lg-4 text-light p-3 m-1"
            style={{ backgroundColor: "#88AB8E" }}
          >
            <Typography textAlign="center" variant="h6" fontWeight={700}>
              System Information
            </Typography>
            <hr className="mb-4" />

            {!loading && !systemInfo && (
              <div className="text-center">
                <DesktopAccessDisabled sx={{ fontSize: 100 }} />
                <Typography>No system information found.</Typography>
                <Typography className="mb-5">
                  Ensure the client service is running on this machine.
                </Typography>
                <Button
                  onClick={getSystemInfo}
                  endIcon={<DesktopMac sx={{ mr: 1 }} />}
                  color="inherit"
                  variant="outlined"
                >
                  Retrieve Information
                </Button>
              </div>
            )}

            {!loading && systemInfo && (
              <div>
                {[
                  ["Manufacturer", systemInfo.manufacturer],
                  ["Model", systemInfo.model],
                  ["System Serial Number", systemInfo.serialNumber],
                  ["MAC Address(es)", systemInfo.macAddresses.join(", ")],
                  ["RAM", `${(systemInfo.ramMB / 1024).toFixed(2)} GB`],
                  ["Operating System", systemInfo.operatingSystem],
                  ["Processor ID", systemInfo.processorId],
                  ["CPU Model", systemInfo.cpuModel],
                ].map(([label, value], i) => (
                  <Typography key={i} className="mb-3">
                    {label}: <b>{value}</b>
                  </Typography>
                ))}

                <div className="mt-5">
                  <Button
                    variant="contained"
                    disabled={registering}
                    onClick={registerComputer}
                    sx={{
                      backgroundColor: "#FF8282",
                      "&:hover": { backgroundColor: "#e67373" },
                    }}
                    endIcon={<DesktopMac />}
                  >
                    {registering
                      ? "Registering..."
                      : "Register as new computer"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Instructions Section */}
          <div
            className="col-lg-3 text-white p-3 m-1"
            style={{ backgroundColor: "#DC8686" }}
          >
            <Typography textAlign="center" variant="h6" fontWeight={700}>
              Important Information
            </Typography>
            <hr className="mb-4" />
            {instructions.map((c, i) => (
              <Typography key={i} className="mb-4">
                {i + 1}. {c}
              </Typography>
            ))}
          </div>

          {/* Network Test Section */}
          <div
            className="col-lg-3 p-3 m-1 text-muted"
            style={{ backgroundColor: "#EEE7DA" }}
          >
            <div className="text-center">
              <Typography variant="h6" fontWeight={700}>
                Network Test
              </Typography>
              <hr className="mb-4" />
              <div className="text-center bounce-fade">
                {errorIcon && errorIcon}
                {error && <Typography className="mt-5">{error}</Typography>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <Typography variant="caption">Version {appVersion}</Typography>
      </div>
    </div>
  );
}

export default SystemHomePage;
