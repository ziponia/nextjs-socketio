import { RoomsRepository } from "../repository/rooms";
import uuid from "uuid/v4";

export const CONNECT_EVENT = "room/connect";
export const CREATE_ROOM_REQUEST = "room/create";
export const LIST_ROOM_DATA_REQUEST = "room/list-room-data-request";
export const JOIN_ROOM = "room/join";
export const LEAVE_ROOM = "room/reave";
export const UPDATE_ROOM_LIST = "room/update-room-list";
export const IN_ROOM_USER = "room/in-room-user";
export const NEW_MESSAGE = "room/new-message";
export const SEND_MESSAEGE = "room/send-message";

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
      this.listRoomDataRequestListener(socket);

      socket.on("disconnect", socket.removeAllListeners);
    });
  }

  public static listRoomDataRequestListener(socket: SocketIO.Socket) {
    socket.on(LIST_ROOM_DATA_REQUEST, (ack: Function) => {
      const rooms = RoomsRepository.getRooms;
      ack(rooms);
    });
  }

  public static creatRoomRequestListener(socket: SocketIO.Socket) {
    socket.on(CREATE_ROOM_REQUEST, (roomNm: string) => {
      const rooms = RoomsRepository.addRoom(roomNm);
      this.io.to("wating-room").emit(UPDATE_ROOM_LIST, rooms);
    });
  }

  public static joinRoomRequestListener(socket: SocketIO.Socket) {
    socket.on(JOIN_ROOM, roomId => {
      socket.join(roomId);
      if (roomId !== "wating-room") {
        this.inRoomUserListener(socket);
      }
    });
  }

  public static leaveRoomRequestListener(socket: SocketIO.Socket) {
    socket.on(LEAVE_ROOM, roomId => {
      socket.leave(roomId);
    });
  }

  public static inRoomUserListener(socket: SocketIO.Socket) {
    socket.on(IN_ROOM_USER, () => {
      socket.broadcast.emit(IN_ROOM_USER, { id: socket.id });
    });

    socket.on(SEND_MESSAEGE, (message: { roomId: string; message: string }) => {
      console.log(`[SERVER] send: ${message.message} to ${message.roomId}`);
      this.io.emit(NEW_MESSAGE, {
        message: message.message,
        senderId: socket.id,
        chatId: uuid()
      });
    });
  }
}

export default RoomSocketHandler;
