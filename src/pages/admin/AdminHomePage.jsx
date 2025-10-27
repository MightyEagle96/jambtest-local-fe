import React, { useEffect, useState } from "react";
import { useAppUser } from "../../contexts/AppUserContext";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
} from "@mui/material";
import { appHttpService } from "../../httpServices/appHttpService";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "@mui/icons-material";
import { Nav } from "react-bootstrap";

function AdminHomePage() {
  const { user } = useAppUser();
  const [loading, setLoading] = useState(false);
  const [dashoardData, setDashboardData] = useState(null);

  const navigate = useNavigate();

  const getDashboard = async () => {
    setLoading(true);
    const { data, error } = await appHttpService("auth/dashboard");
    if (data) {
      setDashboardData(data);
    }

    if (error) {
      toast.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDashboard();
  }, []);
  return (
    <div>
      <div
        className="mt-5 mb-5 text-light d-flex align-items-center justify-content-center"
        style={{ minHeight: "30vh", backgroundColor: "#37353E" }}
      >
        <div className="container pt-4 pb-4 w-100">
          <div className="mb-3">
            <Typography variant="overline" gutterBottom>
              Centre Name
            </Typography>
            <Typography
              textTransform={"uppercase"}
              variant="h4"
              fontWeight={700}
            >
              {user.CentreName}
            </Typography>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <div className="mb-3">
                <Typography variant="overline" gutterBottom>
                  Reference Number
                </Typography>
                <Typography
                  textTransform={"uppercase"}
                  variant="h5"
                  fontWeight={300}
                >
                  {user.ReferenceNumber}
                </Typography>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="mb-3">
                <Typography variant="overline" gutterBottom>
                  Centre Capacity
                </Typography>
                <Typography
                  textTransform={"uppercase"}
                  variant="h5"
                  fontWeight={300}
                >
                  {user.CentreCapacity}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {loading && (
          <div className="text-center">
            <CircularProgress size={20} />
          </div>
        )}
        {dashoardData && (
          <div className="row">
            <div className="col-lg-4">
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  sx={{ height: 140 }}
                  image="https://images.unsplash.com/photo-1643199187247-b3b6009bf0bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbXB1dGVyc3xlbnwwfHwwfHx8MA%3D%3D"
                  title="green iguana"
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    fontSize={24}
                    fontWeight={300}
                    component="div"
                  >
                    Computers:{" "}
                    <span style={{ fontWeight: 700 }}>
                      {dashoardData.computers}
                    </span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    This is the number of computers realized in your centre
                  </Typography>
                </CardContent>
                <CardActions className="mb-5">
                  <Nav.Link
                    as={Link}
                    to="/admin/registercomputers"
                    className="infraction-link"
                  >
                    <p className="text-muted ps-2">
                      VIEW COMPUTERS <ArrowRight />
                    </p>
                  </Nav.Link>
                </CardActions>
              </Card>
            </div>
            <div className="col-lg-4">
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  sx={{ height: 140 }}
                  image="https://images.unsplash.com/photo-1629904853716-f0bc54eea481?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29tcHV0ZXIlMjBsYWJ8ZW58MHx8MHx8fDA%3D"
                  title="green iguana"
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    fontSize={24}
                    fontWeight={300}
                    component="div"
                  >
                    Network Tests:{" "}
                    <span style={{ fontWeight: 700 }}>
                      {dashoardData.computers}
                    </span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    This is the summary of network tests conducted in your
                    centre
                  </Typography>
                </CardContent>
                <CardActions className="mb-5">
                  <Nav.Link
                    as={Link}
                    to="/admin/networktest"
                    className="infraction-link"
                  >
                    <p className="text-muted ps-2">
                      VIEW NETWORK TESTS <ArrowRight />
                    </p>
                  </Nav.Link>
                </CardActions>
              </Card>
            </div>
            <div className="col-lg-4">
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  sx={{ height: 140 }}
                  image="https://plus.unsplash.com/premium_photo-1682310096066-20c267e20605?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZXJyb3J8ZW58MHx8MHx8fDA%3D"
                  title="green iguana"
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    fontSize={24}
                    fontWeight={300}
                    component="div"
                  >
                    Infractions:{" "}
                    <span style={{ fontWeight: 700 }}>
                      {dashoardData.infractions}
                    </span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    This is the number of infraction cases recorded against your
                    centre
                  </Typography>
                </CardContent>
                <CardActions className="mb-5">
                  <Nav.Link
                    as={Link}
                    to="/admin/infractions"
                    className="infraction-link"
                  >
                    <p className="text-muted ps-2">
                      VIEW INFRACTIONS <ArrowRight />
                    </p>
                  </Nav.Link>
                </CardActions>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminHomePage;
