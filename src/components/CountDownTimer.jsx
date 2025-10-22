import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Typography } from "@mui/material";
import format from "format-duration";

function CountDownTimer() {
  const duration = useSelector((state) => state.durationSlice);
  const network = useSelector((state) => state.networkSlice);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  return (
    <div>
      <div>
        <Typography variant="h5" fontWeight={700}>
          {format(timeLeft)}
        </Typography>
      </div>
      <div className="d-none">
        <CountdownCircleTimer
          isPlaying={network}
          duration={duration / 1000}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[7, 5, 2, 0]}
          onUpdate={(e) => {
            // if (e % 60 === 0 || e % 30 === 0) {
            //   if (timeLeft !== 0) sendResponses();
            // }
            if (e % 10 === 0) {
              // if (timeLeft !== 0) sendResponses();
            }
            setTimeLeft(e * 1000);
          }}
          onComplete={() => {
            //submitExam(submissionTypes.timeup);
          }}
        >
          {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
      </div>
    </div>
  );
}

export default CountDownTimer;
