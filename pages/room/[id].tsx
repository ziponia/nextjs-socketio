import React, { useEffect, useState, useRef } from "react";
import { NextPage } from "next";
import { useJoinRoom, useJoinNewUser } from "../../utils/hook";
import { socket } from "../../utils/context";
import {
  IN_ROOM_USER,
  NEW_MESSAGE,
  SEND_MESSAEGE
} from "../../server/handler/RoomSocketHandler";
import uuid from "uuid/v4";

const useNewMessage = () => {
  const [message, setMessage] = useState<{
    message: string;
    senderId: string;
    chatId: string;
  }>();

  useEffect(() => {
    socket.on(
      NEW_MESSAGE,
      (ack: { message: string; senderId: string; chatId: string }) => {
        setMessage(ack);
        console.log(ack);
      }
    );

    return () => {
      socket.off(NEW_MESSAGE);
    };
  }, []);

  return [message];
};

type Props = {
  id: any;
};

const RoomIn: NextPage<Props> = props => {
  const [chats, setChats] = useState<any>([]);
  const [message, setMessage] = useState("");
  useJoinRoom(socket, `/room/${props.id}`);
  const [newMessage] = useNewMessage();
  const { id } = useJoinNewUser(socket);
  const chatContainerRef = useRef<any>();

  const roomInEventEmitter = () => {
    socket.emit(IN_ROOM_USER);
  };

  const newUserJoinHandler = () => {
    setChats(chats.concat({ type: "new", userId: id, chatId: uuid() }));
  };

  const sendMessage = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13 && message.length > 0) {
      socket.emit(SEND_MESSAEGE, {
        roomId: props.id,
        message
      });
      setMessage("");
    }
  };

  useEffect(() => {
    if (newMessage) {
      setChats(
        chats.concat({
          type: "message",
          message: newMessage.message,
          senderId: newMessage.senderId,
          chatId: newMessage.chatId
        })
      );

      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [newMessage]);

  useEffect(roomInEventEmitter, []);

  useEffect(() => {
    id && newUserJoinHandler();
  }, [id]);

  return (
    <div>
      <h3>
        hello world room <small>{props.id}</small>
      </h3>
      <div
        style={{
          width: 800,
          height: 600,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <ul style={{ flex: 1, overflowY: "scroll" }}>
          {chats.map((chat: any) => {
            if (chat.type === "new") {
              return (
                <li key={chat.chatId}>{chat.userId} 님이 입장하셨습니다.</li>
              );
            } else if (chat.type === "message") {
              return <li key={chat.chatId}>{chat.message}</li>;
            }
          })}
          <li
            ref={chatContainerRef}
            style={{ listStyleType: "none", height: 50 }}
          ></li>
        </ul>
        <input
          type="text"
          style={{ display: "block", width: "100%", height: 50 }}
          onChange={e => setMessage(e.target.value)}
          value={message}
          onKeyDown={sendMessage}
        />
      </div>
    </div>
  );
};

RoomIn.getInitialProps = async ({ query }) => {
  return {
    id: query.id
  };
};

export default RoomIn;
