import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { appHttpService } from "../httpServices/appHttpService";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { setDuration } from "../redux/durationSlice";
import { setNetworkTestDetail } from "../redux/networkTestDetail";

function NetworkTestCard() {
  const [searchParams] = useSearchParams();

  const networkTest = searchParams.get("networktest");
  const computer = searchParams.get("computer");
  //const [networkTestDetail, setNetworkTestDetail] = useState(null);

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
      // setNetworkTestDetail(data.networkTest);

      dispatch(setNetworkTestDetail(data.networkTest));

      dispatch(setDuration(data.timeLeft));
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return <></>;
}

export default NetworkTestCard;
