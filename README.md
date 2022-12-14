# tRPC DEMO

- source:https://www.youtube.com/watch?v=Lam0cYOEst8&t=235s

## Simple Query

### Final Project Structure

```bash
.
├── READM.md
├── package.json
├── packages
│   ├── api-server
│   │   ├── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── client
│       ├── package.json
│       ├── postcss.config.js
│       ├── src
│       │   ├── App.tsx
│       │   ├── index.html
│       │   ├── index.scss
│       │   ├── index.ts
│       │   └── trpc.ts
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       └── webpack.config.js
└── yarn.lock
```

### Create api-server

```bash
npx create-mf-app
? Pick the name of your app: api-server
? Project Type: API Server
? Port number: 8080
? Template: express
Your 'api-server' project is ready to go.

Next steps:

▶️ cd api-server
▶️ npm install
▶️ npm start
```

### Create client

```bash
$ npx create-mf-app
? Pick the name of your app: client
? Project Type: Application
? Port number: 3000
? Framework: react
? Language: typescript
? CSS: Tailwind
Your 'client' project is ready to go.

Next steps:

▶️ cd client
▶️ npm install
▶️ npm start
```

### Install package

it will install all package in `api-server` and `client`

```bash
yarn
```

### Add ts.config in api-server

```bash
cd api-server
npx tsc --init
```

after this command it will create a `tsconfig.json` under api-server folder.

### Add ts.config in client

as same as api-server expect a little changed.
To open `tsconfig.json` in client folder.
and remove mark ahead of `jsx`

```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig to read more about this file */

    /* Projects */
    // "incremental": true,                              /* Save .tsbuildinfo files to allow for incremental compilation of projects. */
    // "composite": true,                                /* Enable constraints that allow a TypeScript project to be used with project references. */
    // "tsBuildInfoFile": "./.tsbuildinfo",              /* Specify the path to .tsbuildinfo incremental compilation file. */
    // "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects. */
    // "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
    // "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */

    /* Language and Environment */
    "target": "es2016" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,
    // "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
    "jsx": "preserve" /* Specify what JSX code is generated. */
    // "experimentalDecorators": true,                   /* Enable experimental support for TC39 stage 2 draft decorators. */
    // "emitDecoratorMetadata": true,
  }
}
```

### yarn tRPC server packages to api-server

- @trpc/server
- zod : which is definding objects
- cors: which is come with typescript

```bash
$ cd ../api-server
$ yarn add @trpc/server zod cors
$ yarn add @types/cors -D
```

### Create a api-server router in `index.ts`

#### Create a Query route in `index.ts`

```typescript
...
import * as trpc from "@trpc/server";
// connect trpc to express
import * as trpcExpress from '@trpc/server/adapters/express'

// create a query route
const appRouter = trpc.router().query("hello", {
  resolve() {
    return "Hello World!";
  },
});
const app = express();
const port = 8080;

// to create trpc middleware
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => null,
  })
);
...
```

### yarn start

move to the outer folder and start both of `api-server` and `client`

```bash
$ cd ..
$ yarn start
```

then open the browser `http://localhost:8080/trpc/hello`
you will see the response which you write in `index.ts`

```json
{ "id": null, "result": { "type": "data", "data": "Hello World!" } }
```

### Add cors in api-server

```typescript
//api-server/index.ts
...
import cors from 'cors'
...
// to add cors
app.use(cors());
```

### Export types from api-server

```typescript
//api-server/index.ts
...
//exposed object types
export type AppRouter = typeof appRouter;
```

### Connecting The Client and Server Project

#### add `main` to api-server package

```json
//api-server/package.json
...
  "scripts": {
    "start": "ts-node index.ts"
  },
  "main":"index.ts",
...
```

#### yarn add to client

```bash
$  cd client
$ yarn add api-server@1.0.0 #which in api-server/package.json's name
```

### yarn add packages in Client

```bash
yarn add @trpc/client @trpc/react react-query zod
```

### Create `trpc.ts` in `client/src` folder

```ts
// client/src/trpc.ts
import { createReactQueryHooks } from "@trpc/react";
import { AppRouter } from "api-server";

export const trpc = createReactQueryHooks<AppRouter>();
```

### Update `App.tsx`

#### import package

```tsx
// client/src/App.tsx
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./trpc";
```

#### add query client

```tsx
// client/src/App.tsx
...
const client = new QueryClient();
```

#### add AppContent

```tsx
// client/src/App.tsx
const AppContent = () => {
  const hello = trpc.useQuery(["hello"]);
  console.log("AppContent", hello);
  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      {hello.data && <div>{JSON.stringify(hello.data)}</div>}
    </div>
  );
};
```

#### change `App` to add Provider

```tsx
// client/src/App.tsx
const App = () => {
  // if you write ()=>{} you have to add return
  // or you can just write ()=> trpc.
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: "http://localhost:8080/trpc/",
    })
  );
  // const [trpcClient] = useState(() => {
  //   return trpc.createClient({
  //     url: "http://localhost:8080/trpc/",
  //   });
  // });

  return (
    <trpc.Provider client={trpcClient!} queryClient={client}>
      <QueryClientProvider client={client}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
};
```

After finished this, you can run `yarn start`
and open http://localhost:3000, you will see "Hello World" in the front-end

### yarn add `ts-node-dev -D` to api-server

the server will reload data which you update new code

```bash
$ cd packages/api-server
$ yarn add ts-node-dev -D
```

Then change `scripts:start` in api-server/package.json to `"start":"ts-node-dev index.ts"`

<hr/>

## Building a Simple Chat System

After doing successfully simple query data, let's build the chat system with `tRPC`

### add interface in `api-server/index.ts`

```ts
//api-server/index.ts
...
// add interface
interface ChatMessage {
  user: string;
  message: string;
}
const Messages: ChatMessage[] = [
  { user: "userA", message: "Hello" },
  { user: "userB", message: "Hi" },
];

```

### add more query in `api-server/index.ts`

```ts
//api-server/index.ts
...
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
  .query("getMessage", {
    // to add input
    input: z.number().default(10),
    resolve({ input }) {
      // return Messages;
      return Messages.slice(-input); // To get last 10
    },
  });

```

### add this query function in `client/src/App.tsx`

```tsx
const AppContent = () => {
  const hello = trpc.useQuery(["hello"]);
  const messages = trpc.useQuery(["getMessages", 1]); //1 is to get last 1 data
  console.log("AppContent", hello);
  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      {hello.data && <div>{JSON.stringify(hello.data)}</div>}
      {messages.data && <div>{JSON.stringify(messages.data)}</div>}
    </div>
  );
};
```

Then you will get `[{"user":"userB","message":"Hi"}]` in front-end

### Adding A Mutation in `api-server/index.ts`

```ts
...
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
```

### Add `addMessage` function to front-end

To open `client/src/App.tsx` and type below these code

```tsx
...
// useMutation function to use the method
  const addMessage = trpc.useMutation("addMessage");

  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
```

Then add the parameters to the method which call `mutate`
and if the function is sueecessed,it will call `onSuccess` function.You can use `client.invalidateQueries(["getMessages"])` to get the data again by `getMessages`

```tsx
const onAdd = () => {
  addMessage.mutate(
    {
      message,
      user,
    },
    {
      onSuccess: () => {
        client.invalidateQueries(["getMessages"]);
      },
    }
  );
};
```

you also can adjust style in the front-end,the sample is in `client/src/App.tsx` which in this repo.

<hr/>
