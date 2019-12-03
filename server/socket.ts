import http from "http";
import socketIo from "socket.io";
import RoomSocketHandler from "./handler/RoomSocketHandler";

let io: SocketIO.Server;

const socket = (server: http.Server) => {
  io = socketIo(server);
  RoomSocketHandler.listen(io);
};

export default socket;
