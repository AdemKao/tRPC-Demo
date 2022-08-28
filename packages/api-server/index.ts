import express from "express";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { z } from "zod";

// add interface
interface ChatMessage {
  user: string;
  message: string;
}
const Messages: ChatMessage[] = [
  { user: "userA", message: "Hello" },
  { user: "userB", message: "Hi" },
];

const appRouter = trpc
  .router()
  .query("hello", {
    resolve() {
      return "Hello World!";
    },
  })
  //it's fine to return Messages directly
  //but here we want to typeing route Inputs
  //we will import zod
  .query("getMessages", {
    // to add input
    input: z.number().default(10),
    resolve({ input }) {
      // return Messages;
      return Messages.slice(-input); // To get last 10
    },
  })
  //adding a mutation
  .mutation("addMessage", {
    input: z.object({
      user: z.string(),
      message: z.string(),
    }),
    resolve({ input }) {
      Messages.push(input);
      return Messages;
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
