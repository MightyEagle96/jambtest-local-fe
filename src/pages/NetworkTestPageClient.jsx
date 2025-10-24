import React from "react";
import ComputerDashboard from "../components/ComputerDashboard";
import NetworkTestCard from "../components/NetworkTestCard";
import CountDownTimer from "../components/CountDownTimer";

function NetworkTestPageClient() {
  return (
    <div className="row m-0" style={{ height: "100vh" }}>
      <div className="col-lg-9">
        <div className="p-3">
          <NetworkTestCard />
          <CountDownTimer />
        </div>
      </div>
      <div className="col-lg-3 m-0 bg-light">
        <ComputerDashboard />
      </div>
    </div>
  );
}

export default NetworkTestPageClient;
