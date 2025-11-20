import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { appHttpService } from "../../httpServices/appHttpService";

function TestSummary() {
  const { id } = useParams();
  const [summary, setSummary] = useState({});
  const getData = async () => {
    const { data, eror } = await appHttpService.get("networktest/testsummary", {
      params: { id },
    });

    if (data) {
      setSummary(data);
      console.log(data);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="mt-5 container">
        {summary && (
          <div>
            <div className="mb-5">
              <Typography gutterBottom>Test Summary</Typography>
              <Typography
                variant="h4"
                textTransform={"uppercase"}
                fontWeight={700}
              >
                {summary.testId}
              </Typography>
            </div>
            <div className="col-lg-5">
              <div className="alert alert-info border-0 mb-3">
                <Typography variant="body2">
                  You are seeing this page, because you have already uploaded
                  this network test result.
                </Typography>
              </div>
              <div className="alert alert-light border-0">
                <div className="mb-3">
                  <Typography variant="h5" fontWeight={700}>
                    Test Timelines
                  </Typography>
                </div>
                <Typography variant="body2" gutterBottom>
                  Time Created:{" "}
                  <strong>
                    {new Date(summary.datedCreated).toLocaleString()}
                  </strong>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Time Activated:{" "}
                  <strong>
                    {new Date(summary.timeActivated).toLocaleString()}
                  </strong>
                </Typography>{" "}
                <Typography variant="body2" gutterBottom>
                  Time Ended:{" "}
                  <strong>
                    {new Date(summary.timeEnded).toLocaleString()}
                  </strong>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Time Uploaded:{" "}
                  <strong>
                    {new Date(summary.timeUploaded).toLocaleString()}
                  </strong>
                </Typography>
              </div>
            </div>
            <div className="row text-muted ">
              <div className="col-lg-3 bg-light m-2 p-2">
                <Typography variant="caption" gutterBottom>
                  Test Duration
                </Typography>
                <Typography variant="h5">
                  {summary.duration / (60 * 1000)} minutes
                </Typography>
              </div>
              <div className="col-lg-3  m-2 p-2  bg-light">
                <Typography variant="caption" gutterBottom>
                  Network Losses
                </Typography>
                <Typography variant="h5">{summary.networkLosses}</Typography>
              </div>
              <div className="col-lg-3  m-2 p-2 bg-light">
                <Typography variant="caption" gutterBottom>
                  Tested Computers
                </Typography>
                <Typography variant="h5">{summary.testedComputers}</Typography>
              </div>
              <div className="col-lg-3  m-2 p-2 bg-light">
                <Typography variant="caption" gutterBottom>
                  Response Throughput
                </Typography>
                <Typography variant="h5">
                  {summary.responsesPercentage}%
                </Typography>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestSummary;
