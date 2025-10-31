import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { appHttpService } from "../../httpServices/appHttpService";
import { Button, Chip, IconButton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import format from "format-duration";
import { DesktopMacOutlined } from "@mui/icons-material";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

function NetworkTestPage() {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [computerList, setComputerList] = useState([]);
  const [computer, setComputer] = useState(null);
  const [dashboard, setDashoard] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // DataGrid uses 0-based index
    pageSize: 50, // rows per page
  });

  const navigate = useNavigate();
  const getData = async () => {
    setLoading(true);
    const [testData, getComputerList, testDashboard] = await Promise.all([
      appHttpService(`networktest/view/${id}`),

      appHttpService("networktest/computerlist/" + id, {
        params: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
        },
      }),

      appHttpService("networktest/dashboard", {
        params: {
          id,
        },
      }),
    ]);

    if (testData) {
      if (testData.data) {
        setTest(testData.data);
      }
    }

    if (getComputerList) {
      if (getComputerList.data) {
        setComputerList(getComputerList.data.computers);
        setTotal(getComputerList.data.total);
      }
    }

    if (testDashboard) {
      if (testDashboard.data) {
        setDashoard(testDashboard.data);
        //setCleanedComputers(testDashboard.data);
      }
    }

    setLoading(false);
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
  }, [paginationModel]);

  const endNetworkTest = () => {
    Swal.fire({
      icon: "question",
      title: "End Network Test",
      text: "Are you sure you want to end this test? You will not be able to activate it after it has been ended.",
      showDenyButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data, error } = await appHttpService.get(
          "networktest/endnetworktestadmin",
          {
            params: {
              id,
            },
          }
        );
        if (data) {
          toast.success(data);
          navigate("/admin/networktest");
        }
        if (error) {
          toast.error(error);
        }
      }
    });
  };

  return (
    <div>
      <div className="mt-4 ">
        {test && (
          <>
            <div className="container mb-4">
              <div className="row">
                <div className="col-lg-6">
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
                    <div className="col-lg-6">
                      <Typography variant="caption">Duration</Typography>
                      <Typography>
                        {test.duration / 1000 / 60} minutes
                      </Typography>
                    </div>
                    <div className="col-lg-6">
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
                <div className="col-lg-6 text-end">
                  <Button
                    onClick={endNetworkTest}
                    disabled={!test.active}
                    variant="contained"
                    color="error"
                  >
                    End network test
                  </Button>
                </div>
              </div>
            </div>
            <div className="mb-5">
              <div className="container">
                {dashboard && (
                  <div>
                    <div className="d-flex flex-wrap bg-light p-3 text-muted">
                      <div className="col-lg-3">
                        <Typography variant="overline">computers</Typography>
                        <Typography variant="h6">
                          {dashboard.totalComputers}
                        </Typography>
                      </div>
                      <div className="col-lg-3">
                        <Typography variant="overline">connected</Typography>
                        <Typography variant="h6">
                          {dashboard.connected}
                        </Typography>
                      </div>
                      <div className="col-lg-3">
                        <Typography variant="overline">disconnected</Typography>
                        <Typography variant="h6">
                          {dashboard.disconnected}
                        </Typography>
                      </div>
                      <div className="col-lg-3">
                        <Typography variant="overline">ended</Typography>
                        <Typography variant="h6">{dashboard.ended}</Typography>
                      </div>
                      <div className="col-lg-3">
                        <Typography variant="overline">
                          Total Network Losses
                        </Typography>
                        <Typography variant="h6">
                          {dashboard.totalNetworkLosses}
                        </Typography>
                      </div>
                      <div className="col-lg-3">
                        <Typography variant="overline">
                          Computers with network losses
                        </Typography>
                        <Typography variant="h6">
                          {dashboard.computersWithNetworkLosses}
                        </Typography>
                      </div>
                      <div className="col-lg-3">
                        <Typography variant="overline">
                          Responses/Expected
                        </Typography>
                        <Typography variant="h6">
                          {dashboard.totalResponses}/{dashboard.expected}
                        </Typography>
                      </div>
                      <div className="col-lg-3">
                        <Typography variant="overline">
                          Response Throughput
                        </Typography>
                        <Typography variant="h6">
                          {dashboard.responseThroughput}%
                        </Typography>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-3">
              <DataGrid
                rows={computerList}
                columns={columns}
                loading={loading}
                rowCount={total}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[50, 100]}
              />
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
            <div className="text-uppercase">
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
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default NetworkTestPage;
