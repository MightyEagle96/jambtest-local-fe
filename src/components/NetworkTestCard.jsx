import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { appHttpService } from "../httpServices/appHttpService";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { setDuration } from "../redux/durationSlice";

function NetworkTestCard() {
  const [searchParams] = useSearchParams();

  const networkTest = searchParams.get("networktest");
  const computer = searchParams.get("computer");
  const [networkTestDetail, setNetworkTestDetail] = useState(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const getData = async () => {
    const { data, error, status } = await appHttpService(
      "networktest/myresponse",
      {
        headers: {
          networktest: networkTest,
          computer: computer,
        },
      }
    );

    if (status === 404) {
      navigate("/");
    }
    if (data) {
      setNetworkTestDetail(data.networkTest);

      dispatch(setDuration(data.timeLeft));
      console.log(data);
    }

    if (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      {networkTestDetail && (
        <div className="col-lg-6 alert alert-primary border-0">
          <div className="d-flex flex wrap">
            <div className="me-3 border-end">
              <Typography variant="caption">Network Test ID:</Typography>
              <Typography fontWeight={700}>
                {networkTestDetail.examId}
              </Typography>
            </div>

            <div>
              <Typography variant="caption">Duration:</Typography>
              <Typography fontWeight={700}>
                {networkTestDetail.duration / 1000 / 60} mins
              </Typography>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NetworkTestCard;
