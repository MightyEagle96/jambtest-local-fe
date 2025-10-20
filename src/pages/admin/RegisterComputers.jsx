import { Button, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { appHttpService } from "../../httpServices/appHttpService";
import { Badge, Modal } from "react-bootstrap";
import { ArrowUpward, Refresh } from "@mui/icons-material";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
function RegisterComputers() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const columns = [
    {
      field: "id",
      headerName: "S/N",
      width: 90,
      sortable: false,
      filterable: false,
    },
    {
      field: "serialNumber",
      headerName: "Serial Number",
      width: 200,
      renderCell: (params) => params.value.toUpperCase(),
    },
    {
      field: "manufacturer",
      headerName: "Manufacturer",
      width: 200,
      renderCell: (params) => params.value.toUpperCase(),
    },
    {
      field: "model",
      headerName: "Model",
      width: 200,
      renderCell: (params) => params.value.toUpperCase(),
    },

    {
      field: "ramMB",
      headerName: "RAM (MB)",
      width: 200,
      renderCell: (params) => `${(params.value / 1000).toFixed(2)} GB`,
    },
    { field: "cpuModel", headerName: "CPU Model", width: 200 },
    {
      field: "processorId",
      headerName: "Processor ID",
      width: 200,
      renderCell: (params) => params.value.toUpperCase(),
    },
    { field: "operatingSystem", headerName: "Operating System", width: 200 },
    {
      field: "macAddresses",
      headerName: "MAC Addresses",
      width: 200,
      renderCell: (params) => params.value.join(", "),
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => (
        <span
          className={
            params.value === "not uploaded" ? "text-danger" : "text-success"
          }
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "flagged",
      headerName: "Flagged for infraction",
      width: 200,
      renderCell: (params) =>
        params.value ? (
          <Badge bg="danger">Yes</Badge>
        ) : (
          <Badge bg="success">No</Badge>
        ),
    },
  ];

  const [total, setTotal] = useState(0); // total records in DB
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cleanComputers, setCleanComputers] = useState(0);
  const [infractions, setInfractions] = useState(0);

  const [paginationModel, setPaginationModel] = useState({
    page: 0, // DataGrid uses 0-based index
    pageSize: 50, // rows per page
  });

  const getData = async () => {
    setLoading(true);
    const { data, error } = await appHttpService.get("computer/view", {
      params: {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      },
    });

    if (data) {
      setTotal(data.total);
      setComputers(data.totalComputers);
      setCleanComputers(data.cleanComputers);
      setInfractions(data.infractions);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
    //getFreshComputers();
  }, [paginationModel]);

  const getFreshComputers = async () => {
    const { data } = await appHttpService.get("computer/getcomputers");
    if (data) {
      getData();
    }
  };

  const registerComputers = () => {
    Swal.fire({
      icon: "question",
      title: "Push Registered Computers",
      text: "Are you sure you want to register these computers?\nKindly ensure you do not have any system registered here that belong to another centre as this will result in an infraction.",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { data, error } = await appHttpService.post(
          "computer/uploadcomputer",
          {
            computers,
          }
        );

        if (data) {
          setShow(false);
          getFreshComputers();
          toast.success(data);
        }

        if (error) {
          console.log(error);
          toast.error(error);
        }
        setLoading(false);
      }
    });
  };
  return (
    <div>
      <div className="mt-5">
        <div className="">
          <div className="container">
            <div className="mb-5">
              <Typography
                gutterBottom
                color="#37353E"
                variant="h4"
                fontWeight={700}
              >
                Register Computers
              </Typography>
              <Typography gutterBottom color="GrayText">
                To register a new computer, go to the home page of this
                application and click on the "Register Computers" button.
              </Typography>
              <Typography color="GrayText">
                Make sure the system report server is running on the client
                computer.
              </Typography>
            </div>
            <div className="mb-3">
              <div className="row">
                <div className="col-lg-3">
                  <Stack direction={"row"} spacing={2}>
                    <div>
                      <Typography
                        gutterBottom
                        color="#37353E"
                        variant="h6"
                        fontWeight={700}
                      >
                        Computer List
                      </Typography>
                    </div>
                    <div>
                      <IconButton onClick={getData}>
                        <Refresh />
                      </IconButton>
                    </div>
                  </Stack>
                </div>
                <div className="col-lg-3">
                  <Button
                    onClick={() => setShow(true)}
                    loading={loading}
                    endIcon={<ArrowUpward />}
                    loadingPosition="end"
                    disabled={computers.length === 0}
                  >
                    Push Registration
                  </Button>
                </div>
                <div className="col-lg-6 text-center text-muted rounded p-2 bg-light">
                  <div className="row">
                    <div className="col-lg-4">
                      <Typography variant="caption">Total Computers</Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {total}
                      </Typography>
                    </div>
                    <div className="col-lg-4">
                      <Typography variant="caption">Clean Computers</Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {cleanComputers}
                      </Typography>
                    </div>
                    <div className="col-lg-4">
                      <Typography variant="caption">Infractions</Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {infractions}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3">
            <DataGrid
              columns={columns}
              rows={computers}
              loading={loading}
              rowCount={total}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[50, 100, 200]}
            />
          </div>
        </div>
      </div>
      <Modal size="lg" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Important Announcements</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-warning">
            <div className="row ">
              <div className="col-lg-1">
                <h4>1.</h4>
              </div>
              <div className="col-lg-10">
                <p>
                  Kindly ensure you do not have any system registered here that
                  belongs to another centre as this will result in an
                  infraction.
                </p>
              </div>
            </div>
            <div className="row ">
              <div className="col-lg-1">
                <h4>2.</h4>
              </div>
              <div className="col-lg-10">
                <p>
                  Also note that any system you upload right now will be
                  permanently tied to your center and cannot be modified later
                  on or deleted.
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={registerComputers}>Upload Computers</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RegisterComputers;
