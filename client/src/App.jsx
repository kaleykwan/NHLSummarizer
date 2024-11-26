import "./App.css";
import { GameList } from "./components/GameList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { inject } from "@vercel/analytics";
import { SpeedInsights } from "@vercel/speed-insights/react";

inject();

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameList />
      <SpeedInsights />
    </QueryClientProvider>
  );
}

export default App;
