import { createContext, useMemo, useContext, useEffect } from "react";
import io from "socket.io-client";
import { server } from "./constants/config";

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io(server, { withCredentials: true }), []);

  useEffect(() => {
    // Handle socket connection errors
    socket.on("error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      // Cleanup function to close socket connection
      socket.close();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export { getSocket, SocketProvider };