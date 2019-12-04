import { useEffect, useState, useMemo } from "react";
import {
  JOIN_ROOM,
  LEAVE_ROOM,
  UPDATE_ROOM_LIST,
  CONNECT_EVENT,
  LIST_ROOM_DATA_REQUEST,
  IN_ROOM_USER
} from "../server/handler/RoomSocketHandler";
import { IRoom } from "../server/repository/rooms";

export const useJoinRoom = (socket: SocketIOClient.Socket, roomId: string) => {
  const requestJoin = () => {
    console.log(`join Room: ${roomId}`);
    socket.emit(JOIN_ROOM, roomId);

    return () => {
      console.log(`Leave Room: ${roomId}`);
      socket.emit(LEAVE_ROOM, roomId);
    };
  };

  useEffect(requestJoin, []);
};

export const useRoomsIo = (socket: SocketIOClient.Socket) => {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const roomData = () => {
    console.log("userRoomsIo Mount");
    socket.on(CONNECT_EVENT, (rooms: IRoom[]) => {
      setRooms(rooms);
    });
    socket.on(UPDATE_ROOM_LIST, (rooms: IRoom[]) => {
      setRooms(rooms);
    });

    return () => {
      console.log("use room leave");
      socket.off(CONNECT_EVENT).off(UPDATE_ROOM_LIST);
    };
  };

  useEffect(roomData, []);
  return [rooms];
};

export const useWatingRoom = (socket: SocketIOClient.Socket) => {
  const ms = useMemo(() => socket, [socket]);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const roomData = () => {
    ms.emit(LIST_ROOM_DATA_REQUEST, (rooms: IRoom[]) => {
      setRooms(rooms);
    });

    ms.on(UPDATE_ROOM_LIST, (rooms: IRoom[]) => {
      setRooms(rooms);
    });
    return () => {
      ms.off(UPDATE_ROOM_LIST);
    };
  };

  useEffect(roomData, []);

  return { rooms };
};

export const useJoinNewUser = (socket: SocketIOClient.Socket) => {
  const ms = useMemo(() => socket, [socket]);
  const [id, setId] = useState("");

  const newUserJoinListener = () => {
    ms.on(IN_ROOM_USER, ({ id }: any) => {
      setId(id);
      console.log(`newUserJoinListener: `, id);
    });

    return () => {
      ms.off(IN_ROOM_USER);
    };
  };

  useEffect(newUserJoinListener, []);

  return { id };
};
