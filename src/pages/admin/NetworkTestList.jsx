import {
  Alert,
  AlertTitle,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Modal, Nav } from "react-bootstrap";
import Swal from "sweetalert2";
import { appHttpService } from "../../httpServices/appHttpService";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import {
  Done,
  Clear,
  Delete,
  Upload,
  Save,
  ArrowRight,
  Close,
  ArrowUpward,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { setRefresh } from "../../redux/refreshSlice";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "react-bootstrap";

const thingsToNote = [
  "The test duration must not be less than 60 minutes",
  "You must attain your centre's capacity, with the number of connected computers",
  "Network losses count must be below 45",
  "Response throughput must not be less than 90%",
];
function NetworkTest() {
  const [show, setShow] = useState(false);
  const [duration, setDuration] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshSlice = useSelector((state) => state.refreshSlice);

  const [paginationModel, setPaginationModel] = useState({
    page: 0, // DataGrid uses 0-based index
    pageSize: 50, // rows per page
  });
  const handleClose = () => setShow(false);

  const createNetworkTest = () => {
    Swal.fire({
      icon: "question",
      title: "Create Network Test",
      text: "Create a new network test to be conducted.",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { data, error } = await appHttpService.post(
          "networktest/create",
          {
            duration,
          }
        );

        if (data) {
          getNetworkTests();
          setShow(false);
          toast.success(data);
        }

        if (error) {
          toast.error(error);
        }
        setLoading(false);
      }
    });
  };

  const getNetworkTests = async () => {
    setLoading(true);
    const { data } = await appHttpService("networktest/view", {
      params: {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      },
    });

    if (data) {
      setRows(data.networkTests);
      setRowCount(data.total);
    }

    setLoading(false);
  };

  const columns = [
    {
      field: "id",
      headerName: "S/N",
      width: 70,
    },
    {
      field: "examId",
      headerName: "Test",
      width: 200,
      renderCell: (params) => (
        <Nav.Link as={Link} to={`/admin/networktest/${params.row._id}`}>
          <p className=" text-success">
            View Test <ArrowRight />
          </p>
        </Nav.Link>
      ),
    },
    {
      field: "activate",
      headerName: "Activate/Deactivate",
      width: 200,
      renderCell: (params) => (
        <Button
          disabled={params.row.ended}
          sx={{ textTransform: "capitalize" }}
          onClick={() => toggleactivation(params.row._id, params.row.active)}
        >
          {params.row.active ? "Deactivate Test" : "Activate Test"}
        </Button>
      ),
    },
    {
      field: "upload",
      headerName: "Upload",
      width: 150,
      renderCell: (params) =>
        params.row.status === "uploaded" ? (
          <Typography color="success" variant="overline">
            Uploaded
          </Typography>
        ) : (
          <UploadTest params={params} />
        ),
    },
    {
      field: "duration",
      headerName: "Duration (mins)",
      width: 200,
      renderCell: (params) => params.value / 1000 / 60,
    },

    {
      field: "connectedComputers",
      headerName: "Connected Computers",
      width: 200,
    },

    {
      field: "active",
      headerName: "Active",
      width: 200,
      renderCell: (params) =>
        params.value ? <Done color="success" /> : <Clear color="error" />,
    },
    {
      field: "ended",
      headerName: "Ended",
      width: 200,
      renderCell: (params) =>
        params.value ? <Done color="success" /> : <Clear color="error" />,
    },
    {
      field: "timeEnded",
      headerName: "Time Ended",
      width: 200,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "-",
    },
    {
      field: "timeUploaded",
      headerName: "Time Uploaded",
      width: 200,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "-",
    },

    {
      field: "delete",
      headerName: "Delete",
      width: 150,
      renderCell: (params) =>
        !params.row.timeUploaded ? (
          <IconButton
            disabled={!params.row.timeUploaded}
            onClick={() => deleteExamination(params.row._id)}
          >
            <Delete color="error" />
          </IconButton>
        ) : (
          <IconButton disabled>
            <Delete />
          </IconButton>
        ),
    },
  ];
  useEffect(() => {
    getNetworkTests();
  }, [refreshSlice, paginationModel]);

  const deleteExamination = (id) => {
    Swal.fire({
      icon: "question",
      title: "Delete Test",
      text: "Are you sure you want to delete this test?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        {
          const { data, error } = await appHttpService.delete(
            "networktest/delete",
            {
              params: {
                id,
              },
            }
          );
          if (data) {
            toast.success(data);
            getNetworkTests();
          }
          if (error) {
            toast.error(error);
          }
        }
      }
    });
  };

  const toggleactivation = async (id, status) =>
    Swal.fire({
      icon: "question",
      title: `${status ? "Deactivate" : "Activate"} Network Test`,
      text: `Are you sure you want to ${
        status ? "deactivate" : "activate"
      } this network test?`,
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        {
          const { data, error } = await appHttpService.get(
            "networktest/toggleactivation",
            {
              params: {
                id,
              },
            }
          );
          if (data) {
            toast.success(data);
            getNetworkTests();
          }
          if (error) {
            toast.error(error);
          }
        }
      }
    });

  return (
    <div>
      <div className="mt-5">
        <div className="container mb-4">
          <div className="d-flex justify-content-between">
            <div className="col-lg-3">
              <Typography
                gutterBottom
                color="#37353E"
                variant="h4"
                fontWeight={700}
              >
                Network Test
              </Typography>
              <Typography variant="body2" color="GrayText">
                Conduct a network test for all computers within your facility.
              </Typography>
            </div>
            <div className="col-lg-3">
              <Typography
                gutterBottom
                color="#37353E"
                variant="h4"
                fontWeight={700}
              >
                {rowCount}
              </Typography>
              <Typography variant="body2" color="GrayText">
                Network tests created
              </Typography>
            </div>
            <div className="col-lg-3">
              <Button onClick={() => setShow(true)} variant="contained">
                Create new network test
              </Button>
            </div>
          </div>
        </div>
        <div className="p-3">
          <DataGrid
            columns={columns}
            rows={rows}
            loading={loading}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[50, 100]}
            rowCount={rowCount}
            rowSelection={false}
          />
        </div>
      </div>
      <Modal onHide={handleClose} centered show={show}>
        <Modal.Header className="border-0" closeButton></Modal.Header>
        <Modal.Body>
          <div>
            <div className="mb-4">
              <div className="text-center mb-4">
                <Typography variant="h5" fontWeight={700}>
                  NETWORK TEST DURATION
                </Typography>
              </div>
              <div>
                <TextField
                  fullWidth
                  label="Duration in minutes"
                  type="number"
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-4">
              <Alert severity="info">
                <AlertTitle>
                  Before you can be be able to upload a network test result
                </AlertTitle>
                <ol className="pl-4">
                  {thingsToNote.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ol>
              </Alert>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 bg-light">
          <Button
            endIcon={<Save />}
            loading={loading}
            loadingPosition="end"
            onClick={createNetworkTest}
            variant="contained"
          >
            create new test
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default NetworkTest;

function UploadTest({ params }) {
  console.log(params.row);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const refreshSlice = useSelector((state) => state.refreshSlice);

  const viewSummary = async () => {
    setLoading(true);
    const { data, error } = await appHttpService.get(
      "networktest/testsummary",
      {
        params: { id: params.row._id },
      }
    );

    if (data) {
      setSummary(data);
    }

    if (error) {
      toast.error(error);
    }
    setLoading(false);
  };

  const uploadTest = async () => {
    setLoading(true);
    const response = await appHttpService.get("networktest/upload", {
      params: { id: params.row._id },
    });

    if (response.data) {
      toast.success(response.data);
      setSummary(null);
    }

    if (response.error) {
      toast.error(response.error);
    }
    dispatch(setRefresh(!refreshSlice));

    setLoading(false);
  };
  return (
    <>
      <Button
        endIcon={<Upload />}
        loading={loading}
        disabled={!params.row.ended}
        loadingPosition="end"
        onClick={viewSummary}
      >
        <Typography variant="caption">Upload</Typography>
      </Button>
      {summary && (
        <Modal
          size="lg"
          show={summary}
          centered
          onHide={() => setSummary(null)}
          backdrop="static"
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title>Test Summary</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped borderless>
              <thead>
                <tr>
                  <th>
                    <Typography fontWeight={700}>Item</Typography>
                  </th>
                  <th>
                    <Typography fontWeight={700}>Status</Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Typography variant="body2">
                      Number of tested Computers matches centre's capacity
                    </Typography>
                  </td>
                  <td>
                    {summary.capacityMatched ? (
                      <Done color="success" />
                    ) : (
                      <Close color="error" />
                    )}
                  </td>
                </tr>

                <tr>
                  <td>
                    <Typography variant="body2">
                      Duration is equal to or greater than 60 minutes
                    </Typography>
                  </td>
                  <td>
                    {summary.durationMatched ? (
                      <Done color="success" />
                    ) : (
                      <Close color="error" />
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <Typography variant="body2">
                      Total network losses is less than 45
                    </Typography>
                  </td>
                  <td>
                    {summary.networkLossesThreshold ? (
                      <Done color="success" />
                    ) : (
                      <Close color="error" />
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <Typography variant="body2">
                      Response percentage is equal to or greater than 90%
                    </Typography>
                  </td>
                  <td>
                    {summary.responsesPercentageMatched ? (
                      <Done color="success" />
                    ) : (
                      <Close color="error" />
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer className="border-0 bg-light">
            <Button
              onClick={uploadTest}
              startIcon={<ArrowUpward />}
              disabled={!summary.canUpload}
              variant="contained"
            >
              Upload Test
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
