# tRPC DEMO

- source:https://www.youtube.com/watch?v=Lam0cYOEst8&t=235s

## Create api-server

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

## Create client

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

## Install package

it will install all package in `api-server` and `client`

```bash
yarn
```

## Add ts.config in api-server

```bash
cd api-server
npx tsc --init
```

after this command it will create a `tsconfig.json` under api-server folder.

## Add ts.config in client

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

## yarn tRPC server packages to api-server

- @trpc/server
- zod : which is definding objects
- cors: which is come with typescript

```bash
$ cd ../api-server
$ yarn add @trpc/server zod cors
$ yarn add @types/cors -D
```

## Create a api-server router in `index.ts`

### Create a Query route in `index.ts`

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

## yarn start

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

## Add cors in api-server

```typescript
//api-server/index.ts
...
import cors from 'cors'
...
// to add cors
app.use(cors());
```

## Export types from api-server

```typescript
//api-server/index.ts
...
//exposed object types
export type AppRouter = typeof appRouter;
```

## Connecting The Client and Server Project

### add `main` to api-server package

```json
//api-server/package.json
...
  "scripts": {
    "start": "ts-node index.ts"
  },
  "main":"index.ts",
...
```

### yarn add to client

```bash
$  cd client
$ yarn add api-server@1.0.0 #which in api-server/package.json's name
```

## yarn add packages in Client

```bash
yarn add @trpc/client @trpc/react react-query zod
```

## Create `trpc.ts` in `client/src` folder

```ts
// client/src/trpc.ts
import { createReactQueryHooks } from "@trpc/react";
import { AppRouter } from "api-server";

export const trpc = createReactQueryHooks<AppRouter>();
```
