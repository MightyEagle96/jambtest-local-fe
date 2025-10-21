import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { appHttpService } from "../../httpServices/appHttpService";
import { Chip, Typography } from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";

function NetworkTestPage() {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [cleanedComputers, setCleanedComputers] = useState([]);

  const getData = async () => {
    const [testData, cleanedComputers] = await Promise.all([
      appHttpService(`networktest/view/${id}`),
      appHttpService("computer/cleanedcomputers"),
    ]);

    if (testData) {
      if (testData.data) {
        setTest(testData.data);
      }
    }

    if (cleanedComputers) {
      if (cleanedComputers.data) {
        setCleanedComputers(cleanedComputers.data);
      }
    }
  };

  const columns = [
    //{field:''}
    // { field: "name", headerName: "Name", width: 150 },
    // { field: "ip", headerName: "IP", width: 150 },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="mt-4 ">
        {test && (
          <>
            <div className="container">
              <div className="mb-1">
                <Typography variant="caption" gutterBottom>
                  Test ID
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  textTransform={"uppercase"}
                >
                  {test.examId}
                </Typography>
              </div>
              <div className="row">
                <div className="col-lg-3">
                  <Typography variant="caption">Duration</Typography>
                  <Typography>{test.duration / 1000 / 60} minutes</Typography>
                </div>
                <div className="col-lg-3">
                  <div>
                    <Typography gutterBottom variant="caption">
                      Status
                    </Typography>
                  </div>
                  <Chip
                    label={test.active ? "Active" : "Inactive"}
                    color={test.active ? "success" : "error"}
                  />
                </div>
              </div>
            </div>
            <div className="p-3">{/* <DataGridPro /> */}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default NetworkTestPage;
