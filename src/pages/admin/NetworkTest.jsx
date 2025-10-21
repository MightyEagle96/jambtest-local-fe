import { Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { appHttpService } from "../../httpServices/appHttpService";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { Done, Clear } from "@mui/icons-material";

function NetworkTest() {
  const [show, setShow] = useState(false);
  const [duration, setDuration] = useState(0);
  const [rows, setRows] = useState([]);
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
      }
    });
  };

  const getNetworkTests = async () => {
    const { data } = await appHttpService("networktest/view");

    if (data) {
      setRows(data);
      console.log(data);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
    },
    {
      field: "examId",
      headerName: "Exam ID",
      width: 400,
      renderCell: (params) => (
        <span className="fw-bold text-uppercase">{params.value}</span>
      ),
    },
    {
      field: "duration",
      headerName: "Duration (mins)",
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
      field: "connectedComputers",
      headerName: "Connected Computers",
      width: 200,
    },
    {
      field: "activate",
      headerName: "Activate",
      width: 200,
      renderCell: (params) => (
        <Button
          onClick={() => toggleactivation(params.row._id, params.row.active)}
        >
          {params.row.active ? "Deactivate" : "Activate"}
        </Button>
      ),
    },
  ];
  useEffect(() => {
    getNetworkTests();
  }, []);

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
            <div>
              <Typography
                gutterBottom
                color="#37353E"
                variant="h4"
                fontWeight={700}
              >
                Network Test
              </Typography>
              <Typography variant="body2" color="GrayText">
                Conduct a network test.
              </Typography>
            </div>
            <div>
              <Button onClick={() => setShow(true)} variant="contained">
                Create new network test
              </Button>
            </div>
          </div>
        </div>
        <div className="p-3">
          <DataGrid columns={columns} rows={rows} />
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
          <Button onClick={createNetworkTest} variant="contained">
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default NetworkTest;
