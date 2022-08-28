import express from "express";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";

const appRouter = trpc.router().query("hello", {
  resolve() {
    return "Hello World!";
  },
});

//exposed object types
export type AppRouter = typeof appRouter;

const app = express();
const port = 8080;

// to add cors
app.use(cors());

// to create trpc middleware
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => null,
  })
);

app.get("/", (req, res) => {
  res.send("Hello from api-server");
});

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});
