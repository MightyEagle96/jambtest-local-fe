import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { appHttpService } from "../httpServices/appHttpService";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { setDuration } from "../redux/durationSlice";

function NetworkTestCard() {
  const [searchParams] = useSearchParams();

  const networkTest = searchParams.get("networktest");
  const [networkTestDetail, setNetworkTestDetail] = useState(null);

  const dispatch = useDispatch();
  const getData = async () => {
    const { data, error } = await appHttpService(
      `networktest/view/${networkTest}`
    );
    if (data) {
      setNetworkTestDetail(data);

      dispatch(setDuration(data.duration));
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
