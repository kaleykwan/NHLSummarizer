import "./App.css";
import { GameList } from "./components/GameList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { inject } from '@vercel/analytics';
 
inject();

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameList />
    </QueryClientProvider>
  );
}

export default App;
