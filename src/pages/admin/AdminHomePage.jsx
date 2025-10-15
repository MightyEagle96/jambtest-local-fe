import React from "react";
import { useAppUser } from "../../contexts/AppUserContext";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

function AdminHomePage() {
  const { user } = useAppUser();

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
        <div className="row">
          <div className="col-lg-4">
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                sx={{ height: 140 }}
                image="https://images.unsplash.com/photo-1643199187247-b3b6009bf0bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbXB1dGVyc3xlbnwwfHwwfHx8MA%3D%3D"
                title="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Computers: 230
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  These are the total number of computers realized in your
                  centre
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
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
                <Typography gutterBottom variant="h5" component="div">
                  Network Tests: 230
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  These are the total number of network tests carried out in
                  your centre
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
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
                <Typography gutterBottom variant="h5" component="div">
                  Infractions: 0
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  This is the number of infractions your centre has committed in
                  terms of violating our ethics in facility management
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </div>
          <div className="col-lg-4"></div>
          <div className="col-lg-4"></div>
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage;
