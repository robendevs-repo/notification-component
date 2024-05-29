import { useEffect } from "react";
import io from "socket.io-client";
import { AppConfiguration, SocketEventData } from "../pages/interfaces/Notifications";

type MessageCallback = (data: SocketEventData) => void; // Adjust 'data' type as per your message structure

const useSocketConnection = (
  appConfiguration: {
    host: string;
    apiKey: string;
    appId: string;
    userId: string;
  },
  event: string,
  userRoom: string,
  messageCallback: MessageCallback,
) => {
  useEffect(() => {
    const baseUrl = `ws://${appConfiguration.host}`;
    const socket = io(baseUrl, {
      path: "/socket.io/",
    });

    const loadSocket = () => {
      if (socket.disconnected) {
        socket.connect();
      }

      socket.on("connect", () => {
        socket.emit(`join-${event}`, userRoom);
      });

      socket.on("error", (error) => {
        console.log("Socket error", error);
      });

      socket.on(`${event}`, (data: SocketEventData) => {
        if (typeof messageCallback === "function") {
          messageCallback(data);
        }
      });

      socket.on("disconnect", () => {
        // Handle socket disconnect if needed
      });
    };

    loadSocket();

    return () => {
      socket.off("connect");
      socket.off("error");
      socket.off("disconnect");
      socket.off(`${event}`);

      if (socket.connected) {
        socket.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appConfiguration, event, userRoom, messageCallback]);

  // You can return any values or functions here if needed
};

export default useSocketConnection;
