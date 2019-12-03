import { useEffect, useState } from "react";
import {
  JOIN_ROOM,
  LEAVE_ROOM,
  UPDATE_ROOM_LIST,
  CONNECT_EVENT
} from "../server/handler/RoomSocketHandler";
import { IRoom } from "../server/repository/rooms";

export const useJoinRoom = (socket: SocketIOClient.Socket, roomId: string) => {
  const requestJoin = () => {
    socket.emit(JOIN_ROOM, roomId);

    return () => {
      socket.emit(LEAVE_ROOM, roomId);
    };
  };

  useEffect(requestJoin, []);
};

export const useRoomsIo = (socket: SocketIOClient.Socket) => {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const roomData = () => {
    socket.on(CONNECT_EVENT, (rooms: IRoom[]) => {
      setRooms(rooms);
    });
    socket.on(UPDATE_ROOM_LIST, (rooms: IRoom[]) => {
      setRooms(rooms);
    });
  };

  useEffect(roomData, []);
  return [rooms];
};
