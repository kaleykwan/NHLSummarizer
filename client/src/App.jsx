import "./App.css";
import { GameList } from "./components/GameList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameList />
      <Analytics />
    </QueryClientProvider>
  );
}

export default App;
