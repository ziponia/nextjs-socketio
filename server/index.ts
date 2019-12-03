import Koa from "koa";
import http from "http";
import next from "next";
import logger from "koa-logger";
import socketIo from "socket.io";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const koa = new Koa();
const server = http.createServer(koa.callback());
const io = socketIo(server);

io.on("connection", e => {
  console.log("connect!!");
});

io.on("new", (e: any) => {
  console.log("new user!");
});

const main = async () => {
  await app.prepare();

  // koa.use(logger());
  koa.use(ctx => {
    return handle(ctx.req, ctx.res);
  });

  server.listen(port, () => {
    console.log(`Server Running At PORT: ${port}`);
  });
};

main();
