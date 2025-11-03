import { Button, IconButton, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Modal, Nav } from "react-bootstrap";
import Swal from "sweetalert2";
import { appHttpService } from "../../httpServices/appHttpService";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { Done, Clear, Delete, Upload, Save } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { setRefresh } from "../../redux/refreshSlice";
import { useDispatch, useSelector } from "react-redux";

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
      console.log(data);
    }

    setLoading(false);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
    },
    {
      field: "examId",
      headerName: "Network Test ID",
      width: 400,
      renderCell: (params) => (
        <Nav.Link as={Link} to={`/admin/networktest/${params.row._id}`}>
          <p className="text-uppercase fw-bold text-success">{params.value}</p>
        </Nav.Link>
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
      field: "activate",
      headerName: "Activate",
      width: 200,
      renderCell: (params) => (
        <Button
          disabled={params.row.ended}
          sx={{ textTransform: "capitalize" }}
          onClick={() => toggleactivation(params.row._id, params.row.active)}
        >
          {params.row.active ? "Deactivate" : "Activate"}
        </Button>
      ),
    },
    {
      field: "upload",
      headerName: "Upload",
      width: 150,
      renderCell: (params) => (
        <UploadTest params={params} />
        // <IconButton
        //   disabled={!params.row.ended}
        //   onClick={() => uploadTest(params.row._id)}
        // >
        //   <Upload color={!params.row.ended ? "disabled" : "success"} />
        // </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 150,
      renderCell: (params) =>
        !params.row.timeUploaded ? (
          <IconButton onClick={() => deleteExamination(params.row._id)}>
            <Delete color="error" />
          </IconButton>
        ) : (
          <Typography variant="overline">Uploaded</Typography>
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
          />
        </div>
      </div>
      <Modal onHide={handleClose} centered show={show}>
        <Modal.Header className="border-0" closeButton></Modal.Header>
        <Modal.Body>
          <div>
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
        </Modal.Body>
        <Modal.Footer className="border-0 bg-light">
          <Button
            endIcon={<Save />}
            loading={loading}
            loadingPosition="end"
            onClick={createNetworkTest}
            variant="contained"
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default NetworkTest;

function UploadTest({ params }) {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const refreshSlice = useSelector((state) => state.refreshSlice);

  const uploadTest = async () => {
    setLoading(true);
    const { data, error } = await appHttpService.get("networktest/upload", {
      params: { id: params.row._id },
    });

    if (data) {
      dispatch(setRefresh(!refreshSlice));
      toast.success(data);
    }

    if (error) {
      toast.error(error);
    }
    setLoading(false);
  };
  return (
    <Button
      endIcon={<Upload />}
      loading={loading}
      disabled={!params.row.ended}
      loadingPosition="end"
      onClick={uploadTest}
    >
      <Typography variant="caption">Upload</Typography>
    </Button>
  );
}
