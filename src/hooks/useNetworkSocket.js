// import { useEffect, useRef } from "react";

// function useNetworkSocket(networktest, computer, timeLeft) {
//   const socketRef = useRef(null);

//   useEffect(() => {
//     const socket = new WebSocket(
//       `ws://${window.location.protocol}//${window.location.hostname}:4000`
//     );

//     socket.onopen = () => {
//       console.log("Connected to WS server");
//     };

//     socket.onclose = () => {
//       console.log("Disconnected from WS server");
//     };

//     socketRef.current = socket;

//     return () => {
//       socket.close();
//     };
//   }, []);

//   const sendResponses = () => {
//     if (socketRef.current?.readyState === WebSocket.OPEN) {
//       socketRef.current.send(
//         JSON.stringify({
//           type: "sendResponse",
//           networktest,
//           computer,
//           timeLeft,
//         })
//       );
//     }
//   };

//   return { sendResponses };
// }

// export default useNetworkSocket;

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// export default function useNetworkSocket(networktest, computer, timeLeft) {
//   const socketRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const socket = new WebSocket(`ws://${window.location.hostname}:4000`);
//     socketRef.current = socket;

//     socket.onopen = () => {
//       console.log("Connected to WebSocket server");
//     };

//     socket.onclose = () => {
//       console.log("Disconnected from WebSocket server");
//     };

//     socket.onerror = (err) => {
//       console.error("WebSocket error:", err);
//     };

//     return () => {
//       socket.close();
//     };
//   }, []); // run once

//   const sendResponsesData = () => {
//     if (socketRef.current?.readyState === WebSocket.OPEN) {
//       socketRef.current.send(
//         JSON.stringify({
//           type: "sendResponse",
//           networktest,
//           computer,
//           timeLeft,
//         })
//       );
//     } else {
//       console.warn("WebSocket not ready");
//     }
//   };

//   return { sendResponsesData }; // ✅ must return object with this property
// }

export const useNetworkSocket = (networktest, computer, timeLeft) => {
  const socketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    socketRef.current = new WebSocket("ws://your-server-address");

    socketRef.current.onopen = () => {
      socketRef.current.send(
        JSON.stringify({ type: "register", computer, networktest })
      );
    };

    socketRef.current.onmessage = (message) => {
      const data = JSON.parse(message.data);

      if (data.type === "error" && data.reason === "no-matching-response") {
        console.warn("No matching response, returning to homepage...");
        navigate("/"); // redirect to homepage
      }
    };

    return () => {
      socketRef.current.close();
    };
  }, [networktest, computer, navigate]);

  const sendResponsesData = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({ type: "ping", networktest, computer, timeLeft })
      );
    }
  };

  return { sendResponsesData };
};
