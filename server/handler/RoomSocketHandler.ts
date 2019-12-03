import { RoomsRepository } from "../repository/rooms";

export const CONNECT_EVENT = "room/connect";
export const CREATE_ROOM_REQUEST = "room/create";
export const LIST_ROOM_DATA_REQUEST = "room/list-room-data-request";
export const JOIN_ROOM = "room/join";
export const LEAVE_ROOM = "room/reave";
export const UPDATE_ROOM_LIST = "room/update-room-list";

class RoomSocketHandler {
  private static io: SocketIO.Server;

  public static listen(io: SocketIO.Server) {
    this.io = io;

    this.connect();
  }

  /**
   * 최초 접속시
   */
  public static connect() {
    this.io.on("connection", socket => {
      socket.emit(CONNECT_EVENT, RoomsRepository.getRooms);

      this.creatRoomRequestListener(socket);
      this.joinRoomRequestListener(socket);
      this.leaveRoomRequestListener(socket);
    });
  }

  public static creatRoomRequestListener(socket: SocketIO.Socket) {
    socket.on(CREATE_ROOM_REQUEST, (roomNm: string) => {
      const rooms = RoomsRepository.addRoom(roomNm);
      console.log(`create room request: ${roomNm}`);
      this.io.sockets.emit(UPDATE_ROOM_LIST, rooms);
    });
  }

  public static joinRoomRequestListener(socket: SocketIO.Socket) {
    socket.on(JOIN_ROOM, roomId => {
      console.log(`join ${socket.id} - ${roomId}`);
      socket.join(roomId);
    });
  }

  public static leaveRoomRequestListener(socket: SocketIO.Socket) {
    socket.on(LEAVE_ROOM, roomId => {
      console.log(`leave ${socket.id} - ${roomId}`);
      socket.leave(roomId);
    });
  }
}

export default RoomSocketHandler;
