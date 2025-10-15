import { Button, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { appHttpService } from "../../httpServices/appHttpService";
import { Badge } from "react-bootstrap";
import { Refresh } from "@mui/icons-material";
function RegisterComputers() {
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
  ];

  const [rowCount, setRowCount] = useState(0); // total records in DB
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(false);

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
      setRowCount(data.total);
      setComputers(data.totalComputers);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [paginationModel]);
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
              <div className="row d-flex align-items-end">
                <div className="col-lg-4">
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
                  <Badge>{rowCount} Computer(s)</Badge>
                </div>
                <div className="col-lg-4">
                  <Button>Push Registration</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3">
            <DataGrid
              columns={columns}
              rows={computers}
              loading={loading}
              rowCount={rowCount}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[50, 100, 200]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterComputers;
