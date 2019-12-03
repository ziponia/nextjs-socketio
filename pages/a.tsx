import React, { useEffect } from "react";
import { NextPage } from "next";
import io from "socket.io-client";

const A: NextPage = () => {
  useEffect(() => {
    const socket = io();
    socket.emit("new", { message: "hello" });
    console.log("io!");
  }, []);
  return <h1>a</h1>;
};

export default A;
