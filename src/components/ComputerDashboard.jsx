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
          <div className="text-center text-muted text-uppercase text-wrap">
            <div className="mb-4">
              <DesktopMacOutlined sx={{ fontSize: 100 }} />
            </div>
            <div>
              <div className="mb-2">
                <Typography variant="overline">Manufacturer</Typography>
                <Typography fontWeight={700}>
                  {computerDetail.manufacturer}
                </Typography>
              </div>
              <div className="mb-2">
                <Typography variant="overline">Model</Typography>
                <Typography fontWeight={700}>{computerDetail.model}</Typography>
              </div>
              <div className="mb-2">
                <Typography variant="overline">System Serial Number</Typography>
                <Typography fontWeight={700}>
                  {computerDetail.serialNumber}
                </Typography>
              </div>
              <div className="mb-2">
                <Typography variant="overline">MAC Address(es)</Typography>
                <Typography fontWeight={700}>
                  {computerDetail.macAddresses.join(", ")}
                </Typography>
              </div>
              <div className="mb-2">
                <Typography variant="overline">RAM (GB)</Typography>
                <Typography fontWeight={700}>
                  {(computerDetail.ramMB / 1024).toFixed(2)}
                </Typography>
              </div>
              <div className="mb-2">
                <Typography variant="overline">Operating system</Typography>
                <Typography fontWeight={700}>
                  {computerDetail.operatingSystem}
                </Typography>
              </div>
              <div className="mb-2">
                <Typography variant="overline">processor id</Typography>
                <Typography fontWeight={700}>
                  {computerDetail.processorId}
                </Typography>
              </div>
              <div className="mb-2">
                <Typography variant="overline">cpu model</Typography>
                <Typography fontWeight={700}>
                  {computerDetail.cpuModel}
                </Typography>
              </div>
              <div className="mb-2">
                <Typography variant="overline">IP Address</Typography>
                <Typography fontWeight={700}>{computerDetail.ip}</Typography>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComputerDashboard;
