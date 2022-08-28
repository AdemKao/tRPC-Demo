import React, { useState } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./trpc";

import "./index.scss";

const client = new QueryClient();

const AppContent = () => {
  const hello = trpc.useQuery(["hello"]);
  const getMessages = trpc.useQuery(["getMessages"]); //1 is to get last 1 data

  const addMessage = trpc.useMutation("addMessage");

  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

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

  const onDelete = () => {};

  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      {hello.data && <div>{JSON.stringify(hello.data)}</div>}
      <div>
        {(getMessages.data ?? []).map((row) => (
          <div key={row.message}>{JSON.stringify(row)}</div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="p-5  border-2 border-gray-300 rounded-lg w-full"
          placeholder="User"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-5  border-2 border-gray-300 rounded-lg w-full"
          placeholder="Message"
        />
        <button onClick={onAdd}>Add message</button>
      </div>
    </div>
  );
};

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

ReactDOM.render(<App />, document.getElementById("app"));
