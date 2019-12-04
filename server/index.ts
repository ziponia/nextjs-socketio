import Koa from "koa";
import http from "http";
import next from "next";
import socket from "./socket";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const koa = new Koa();
const server = http.createServer(koa.callback());
socket(server); // init socket io server

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
