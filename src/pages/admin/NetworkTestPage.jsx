import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { appHttpService } from "../../httpServices/appHttpService";
import { Chip, IconButton, Typography } from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import format from "format-duration";
import { DesktopMacOutlined } from "@mui/icons-material";
import { Modal } from "react-bootstrap";

function NetworkTestPage() {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [cleanedComputers, setCleanedComputers] = useState([]);
  const [computerList, setComputerList] = useState([]);
  const [computer, setComputer] = useState(null);
  const getData = async () => {
    const [testData, getComputerList] = await Promise.all([
      appHttpService(`networktest/view/${id}`),

      appHttpService("networktest/computerlist/" + id),
    ]);

    if (testData) {
      if (testData.data) {
        setTest(testData.data);
      }
    }

    if (getComputerList) {
      if (getComputerList.data) {
        console.log(getComputerList.data);
        setComputerList(getComputerList.data);
      }
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "view",
      headerName: "View",
      renderCell: (params) => (
        <IconButton onClick={() => setComputer(params.row)}>
          <DesktopMacOutlined />
        </IconButton>
      ),
    },

    { field: "ipAddress", headerName: "IP Address", flex: 1 },
    { field: "responses", headerName: "Responses", flex: 1 },
    { field: "networkLosses", headerName: "Network Losses", flex: 1 },
    {
      field: "expected",
      headerName: "Expected",
      flex: 1,
      renderCell: () => (test ? test.duration / 1000 / 60 : 0),
    },
    {
      field: "timeLeft",
      headerName: "Time Left (min)",
      flex: 1,
      renderCell: (params) => format(params.value),
    },
    {
      field: "loggedInAt",
      headerName: "Logged In At",
      flex: 1,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "-",
    },
    {
      field: "endedAt",
      headerName: "Ended At",
      flex: 1,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "-",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,

      renderCell: (params) => (
        <span className={"text-uppercase " + switchStatus(params.value)}>
          {params.value}
        </span>
      ),
    },
    // {field:''}
  ];

  function switchStatus(status) {
    if (status === "connected") {
      return "text-success";
    } else if (status === "disconnected") {
      return "text-danger";
    } else if (status === "ended") {
      return "text-warning";
    }
  }
  useEffect(() => {
    getData();

    const interval = setInterval(() => {
      getData();
    }, 60_000);

    return () => {
      clearInterval(interval);
    };
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
            <div className="p-3">
              <DataGridPro rows={computerList} columns={columns} />
            </div>
          </>
        )}
      </div>
      <Modal show={computer} onHide={() => setComputer(null)}>
        <Modal.Header closeButton>
          <Modal.Title>{computer && computer.ipAddress}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {computer && (
            <>
              <div className="mb-2">
                <Typography variant="overline">Manufacturer</Typography>
                <Typography fontWeight={700}>
                  {computer.computer.manufacturer}
                </Typography>
              </div>
              <div className="mb-2">
                <Typography variant="overline">System Serial Number</Typography>
                <Typography fontWeight={700}>
                  {computer.computer.serialNumber}
                </Typography>
              </div>
              <div className="mb-2">
                <Typography variant="overline">MAC Address(es)</Typography>
                <Typography fontWeight={700}>
                  {computer.computer.macAddresses.join(", ")}
                </Typography>
              </div>
              <div className="mb-2">
                <Typography variant="overline">RAM (GB)</Typography>
                <Typography fontWeight={700}>
                  {(computer.computer.ramMB / 1024).toFixed(2)}
                </Typography>
              </div>
              <div className="mb-2">
                <Typography variant="overline">Operating system</Typography>
                <Typography fontWeight={700}>
                  {computer.computer.operatingSystem}
                </Typography>
              </div>
              <div className="mb-2">
                <Typography variant="overline">processor id</Typography>
                <Typography fontWeight={700}>
                  {computer.computer.processorId}
                </Typography>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default NetworkTestPage;
