import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";

function NetworkTest() {
  const [show, setShow] = useState(false);
  const [duration, setDuration] = useState(0);

  const handleClose = () => setShow(false);

  return (
    <div>
      <div className="mt-5">
        <div className="container">
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
                {" "}
                Create new network test
              </Button>
            </div>
          </div>
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
          <Button variant="contained">Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default NetworkTest;
