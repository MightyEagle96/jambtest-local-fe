import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Avatar, Button, LinearProgress, Typography } from "@mui/material";
import format from "format-duration";
import { useNavigate, useSearchParams } from "react-router-dom";
import { appHttpService } from "../httpServices/appHttpService";
import { setNetwork } from "../redux/networkSlice";
import { Modal } from "react-bootstrap";
import { Refresh, WifiOff } from "@mui/icons-material";
import { toast } from "react-toastify";
function CountDownTimer() {
  const [loading, setLoading] = useState(false);
  const networkTestDetail = useSelector(
    (state) => state.networkTestDetailSlice
  );
  const [question, setQuestion] = useState({
    question: "Network Test has begun",
    options: [
      "Ensure connectivity",
      "Ensure security",
      "Ensure speed",
      "Ensure packet delivery",
    ],
    responses: 0,
    maxResponses: 0,
  });
  const duration = useSelector((state) => state.durationSlice);
  const network = useSelector((state) => state.networkSlice);

  const [timeLeft, setTimeLeft] = useState(0);
  const [searchParams] = useSearchParams();
  const networktest = searchParams.get("networktest");
  const computer = searchParams.get("computer");

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const sendResponses = async () => {
    const { data, status } = await appHttpService.post(
      "networktest/sendresponses",
      {
        networktest,
        computer,
        timeLeft,
      }
    );

    if (status === 404) {
      navigate("/");
      return;
    }
    if (data) {
      getQuestionAndResponses();
      // console.log(data);
    }
  };

  const getQuestionAndResponses = async () => {
    const { data } = await appHttpService.post(
      "networktest/questionandresponsecount",
      {
        networktest,
        computer,
      }
    );

    if (data) {
      setQuestion(data);
    }
  };

  const endNetworkTest = async (type) => {
    const { data } = await appHttpService.post("networktest/endnetworktest", {
      networktest,
      computer,
    });
    if (data) {
      navigate("/");
      // console.log(data);
    }
  };

  const networkPing = async () => {
    setLoading(true);
    const { data, error } = await appHttpService("networktest/ping");
    if (data) {
      dispatch(setNetwork(true));
      // console.log(data);
    }
    if (!data || error) {
      toast.error("Network connection lost");
      dispatch(setNetwork(false));
    }
    setLoading(false);
  };
  return (
    <div className="container">
      {networkTestDetail && (
        <>
          <div className="alert alert-success border-0">
            <div className="d-flex justify-content-between">
              <div className="">
                <Typography variant="caption">Network Test ID:</Typography>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  textTransform={"uppercase"}
                >
                  {networkTestDetail.examId}
                </Typography>
              </div>

              <div>
                <Typography variant="caption">Duration:</Typography>
                <Typography variant="h5" fontWeight={700}>
                  {networkTestDetail.duration / 1000 / 60} mins
                </Typography>
              </div>
              <div>
                <Typography variant="caption">Time Left:</Typography>
                <Typography variant="h5" fontWeight={700}>
                  {format(timeLeft)}
                </Typography>
              </div>
            </div>
          </div>

          <div className="d-none">
            <CountdownCircleTimer
              isPlaying={network}
              duration={duration / 1000}
              colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
              colorsTime={[7, 5, 2, 0]}
              onUpdate={(e) => {
                if (e % 10 === 0 && timeLeft !== 0) {
                  networkPing();
                }
                if (e % 60 === 0) {
                  if (timeLeft !== 0) sendResponses();
                }
                setTimeLeft(e * 1000);
              }}
              onComplete={() => {
                endNetworkTest();
              }}
            >
              {({ remainingTime }) => remainingTime}
            </CountdownCircleTimer>
          </div>

          <div className="mt-3 rounded p-3 rounded bg-light">
            <div className="mb-3">
              <Typography variant="caption">Question</Typography>
              <Typography fontSize={22}>{question?.question}</Typography>
            </div>
            <div className="mb-3">
              <Typography variant="caption">Options</Typography>

              {question?.options.map((option, index) => (
                <Typography fontSize={18} key={index} className="mb-4">
                  {index + 1}. {option}
                </Typography>
              ))}
            </div>
          </div>
          {question.maxResponses !== 0 ? (
            <div className="text-center mt-5">
              <div>
                <Typography fontWeight={700} color="#456882">
                  {question.responses}/{question.maxResponses} questions
                  answered
                </Typography>
              </div>
              <div className="mt-5">
                <LinearProgress
                  variant="determinate"
                  value={(question.responses / question.maxResponses) * 100}
                />
              </div>
            </div>
          ) : (
            <div className="text-center mt-5">
              <div>
                <Typography fontWeight={700} color="#456882">
                  {question.responses}/{networkTestDetail.duration / 1000 / 60}{" "}
                  questions answered
                </Typography>
              </div>
              <div className="mt-5">
                <LinearProgress
                  variant="determinate"
                  value={
                    question.responses /
                    ((networkTestDetail.duration / 1000 / 60) * 100)
                  }
                />
              </div>
            </div>
          )}
        </>
      )}
      <Modal
        size="xl"
        centered
        show={!network}
        backdrop="static"
        onHide={() => networkPing()}
      >
        <Modal.Header className="border-0" closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="d-flex justify-content-center">
              <Avatar
                sx={{ height: 100, width: 100, backgroundColor: "#EE6983" }}
              >
                <WifiOff sx={{ width: 70, height: 70 }} />
              </Avatar>
            </div>
            <div className="text-center mt-3">
              <Typography color="GrayText" variant="h6" fontWeight={700}>
                NETWORK CONNECTION LOST
              </Typography>
            </div>
            <div className="mb-4 text-center mt-3 ">
              <Button
                loading={loading}
                endIcon={<Refresh />}
                loadingPosition="end"
                onClick={() => networkPing()}
              >
                {" "}
                Retry Connection
              </Button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0"></Modal.Footer>
      </Modal>
    </div>
  );
}
export default CountDownTimer;
