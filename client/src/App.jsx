import "./App.css";
import { GameList } from "./components/GameList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameList />
    </QueryClientProvider>
  );
}

export default App;
