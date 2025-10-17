import { Typography, Button } from "@mui/material";
import React, { use, useEffect, useState } from "react";
import { appHttpService } from "../../httpServices/appHttpService";
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Table } from "react-bootstrap";
import { useAppUser } from "../../contexts/AppUserContext";
import { Star } from "@mui/icons-material";

function InfractionReport() {
  const { user } = useAppUser();

  console.log(user);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // DataGrid uses 0-based index
    pageSize: 50, // rows per page
  });
  const [rows, setRows] = useState([]);

  const [centresInvolved, setCentresInvolved] = useState([]);

  const getData = async () => {
    const { data, error } = await appHttpService("computer/infractionreports", {
      params: {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      },
    });

    if (data) {
      setRows(data.results);
      console.log(data);
      // setRowCount(data.total);
      // setComputers(data.totalComputers);
    }
  };

  useEffect(() => {
    getData();
  }, [paginationModel]);

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
      field: "centres Involved",
      headerName: "Centres Involved",
      width: 200,
      renderCell: (params) => (
        <Button
          onClick={() => {
            setCentresInvolved(params.row.involvedCentres);
            console.log(params.row.involvedCentres);
          }}
        >
          {params.row.involvedCentres.length}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="mt-5 mb-3">
        <div className="container">
          <Typography
            gutterBottom
            color="#37353E"
            variant="h4"
            fontWeight={700}
          >
            Infraction Reports
          </Typography>
        </div>
      </div>
      <div className="p-3">
        <DataGrid
          columns={columns}
          rows={rows}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>
      <Modal
        size="lg"
        show={centresInvolved.length > 0}
        onHide={() => setCentresInvolved([])}
      >
        <Modal.Header closeButton>
          <Modal.Title>Centres sharing this computer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table borderless striped>
            <thead>
              <tr>
                <th>Centre Name</th>
                <th>State</th>
                <th>Date Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {centresInvolved.map((centre, index) => (
                <tr key={index}>
                  <td className="col-lg-5">
                    <Typography
                      variant="body2"
                      textTransform={"uppercase"}
                      color="GrayText"
                    >
                      {centre.centre.CentreName}{" "}
                    </Typography>
                    {centre.centre.CentreName === user.CentreName && (
                      <Star color="warning" />
                    )}
                  </td>
                  <td className="col-lg-3">
                    <Typography
                      variant="body2"
                      textTransform={"uppercase"}
                      color="GrayText"
                    >
                      {centre.centre.State}
                    </Typography>
                  </td>
                  <td className="col-lg-3">
                    <Typography
                      variant="body2"
                      textTransform={"uppercase"}
                      color="GrayText"
                    >
                      {new Date(centre.dateTested).toLocaleString()}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* <ul>
            {centresInvolved.map((centre, index) => (
              <li key={index}>{centre}</li>
            ))}
          </ul> */}
        </Modal.Body>
      </Modal>
    </div>
  );
}

// Detail panel content component

export default InfractionReport;
