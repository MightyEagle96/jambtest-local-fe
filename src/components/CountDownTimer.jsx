import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { LinearProgress, Typography } from "@mui/material";
import format from "format-duration";
import { useNavigate, useSearchParams } from "react-router-dom";
import { appHttpService } from "../httpServices/appHttpService";
function CountDownTimer() {
  const networkTestDetail = useSelector(
    (state) => state.networkTestDetailSlice
  );
  const [question, setQuestion] = useState({
    question: "Network Test has begun",
    options: [
      "Ensure connectivity",
      "Ensure security",
      "Ensure speed",
      "Other",
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
  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <div className="col-lg-10">
          {networkTestDetail && (
            <div className="c alert alert-danger border-0">
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
          )}
        </div>
      </div>

      <div className="d-none">
        <CountdownCircleTimer
          isPlaying={network}
          duration={duration / 1000}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[7, 5, 2, 0]}
          onUpdate={(e) => {
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
      {question.maxResponses !== 0 && (
        <div className="text-center mt-5">
          <div>
            <Typography fontWeight={700} color="#456882">
              {question.responses}/{question.maxResponses} questions answered
            </Typography>
          </div>
          <div className="mt-5">
            <LinearProgress
              variant="determinate"
              value={(question.responses / question.maxResponses) * 100}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default CountDownTimer;
