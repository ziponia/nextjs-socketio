import React, { useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useJoinRoom, useWatingRoom } from "../utils/hook";
import { CREATE_ROOM_REQUEST } from "../server/handler/RoomSocketHandler";
import { IRoom } from "../server/repository/rooms";
import { socket } from "../utils/context";

type Props = {};

const Index: NextPage<Props> = () => {
  useJoinRoom(socket, "wating-room");
  const { rooms } = useWatingRoom(socket);

  const [newRoom, setNewRoom] = useState("");

  const createRoomEnterHandler = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newRoom.length > 0) {
      if (rooms.filter(room => newRoom === room.roomNm).length > 0) {
        alert("이미 존재하는 방이름");
        return;
      }
      socket.emit(CREATE_ROOM_REQUEST, newRoom);
      setNewRoom("");
    }
  };
  return (
    <div>
      <input
        type="text"
        onChange={e => setNewRoom(e.target.value)}
        value={newRoom}
        onKeyDown={createRoomEnterHandler}
      />
      <ul>
        {rooms.map((room: IRoom) => (
          <li key={room.id}>
            <Link href={`/room/[id]`} as={`/room/${room.id}`}>
              <a>{room.roomNm}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;
