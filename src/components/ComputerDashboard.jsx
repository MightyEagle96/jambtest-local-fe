import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { appHttpService } from "../httpServices/appHttpService";
import { DesktopMacOutlined } from "@mui/icons-material";
import Typography from "@mui/material/Typography";

function ComputerDashboard() {
  const [searchParams] = useSearchParams();
  const [computerDetail, setComputerDetail] = useState(null);

  const computer = searchParams.get("computer");

  // console.log({ networkTest, computer });

  const getcomputer = async () => {
    const { data } = await appHttpService(`computer/viewcomputer/${computer}`);

    if (data) {
      setComputerDetail(data);
    }
  };

  useEffect(() => {
    getcomputer();
  }, []);

  return (
    <div>
      {computerDetail && (
        <div className="pt-5">
          <div className="text-muted   text-wrap">
            <div
              className="mb-4 pt-2 pb-2 text-white  text-center"
              style={{ backgroundColor: "#016B61" }}
            >
              <DesktopMacOutlined sx={{ fontSize: 80 }} />
            </div>
            <div className="p-3">
              <div className="mb-3">
                <Typography>
                  Manufacturer:{" "}
                  <span className="fw-bold text-uppercase">
                    {computerDetail.manufacturer}
                  </span>
                </Typography>
              </div>
              <div className="mb-3">
                <Typography>
                  Model:{" "}
                  <span className="fw-bold text-uppercase">
                    {computerDetail.model}
                  </span>
                </Typography>
              </div>
              <div className="mb-3">
                <Typography>
                  Serial Number:{" "}
                  <span className="fw-bold text-uppercase">
                    {computerDetail.serialNumber}
                  </span>
                </Typography>
              </div>
              <div className="mb-3">
                <Typography>
                  MAC Address(es):{" "}
                  <span className="fw-bold text-uppercase">
                    {computerDetail.macAddresses.join(", ")}
                  </span>
                </Typography>
              </div>
              <div className="mb-3">
                <Typography>
                  RAM (GB):{" "}
                  <span className="fw-bold text-uppercase">
                    {(computerDetail.ramMB / 1024).toFixed(2)}
                  </span>
                </Typography>
              </div>
              <div className="mb-3">
                <Typography>
                  Operating System:{" "}
                  <span className="fw-bold text-uppercase">
                    {computerDetail.operatingSystem}
                  </span>
                </Typography>
              </div>
              <div className="mb-3">
                <Typography>
                  Processor ID:{" "}
                  <span className="fw-bold text-uppercase">
                    {computerDetail.processorId}
                  </span>
                </Typography>
              </div>
              <div className="mb-3">
                <Typography>
                  CPU Model:{" "}
                  <span className="fw-bold text-uppercase">
                    {computerDetail.cpuModel}
                  </span>
                </Typography>
              </div>
              <div className="mb-3">
                <Typography>
                  IP Address:{" "}
                  <span className="fw-bold text-uppercase">
                    {computerDetail.ip}
                  </span>
                </Typography>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComputerDashboard;
