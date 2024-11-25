import React from "react";
import { useQuery } from "@tanstack/react-query";
import GameBoxscore from "./GameBoxscore.jsx";
import "../styles/GameList.css";

export const GameList = () => {
  const { isPending, data, error } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await fetch("nhl-summarizer-backend.vercel.app/game/current/");
      if (!response.ok) {
        throw new Error("Failed to fetch today's games");
      }
      return response.json();
    },
    refetchInterval: 1000 * 60 * 1,
  });

  if (isPending) {
    return "loading";
  }

  function listOfGames() {
    return data.map((game) => {
      return <GameBoxscore game={game} key={game._id} />;
    });
  }

  return (
    <div>
      <div className="game-list">{listOfGames()}</div>
    </div>
  );
};
