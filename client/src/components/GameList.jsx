import React from "react";
import { useQuery } from "@tanstack/react-query";
import GameBoxscore from "./GameBoxscore.jsx";
import "../styles/GameList.css";

export const GameList = () => {
  const { isPending, data, error } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await fetch(
        `https://nhl-summarizer-backend.vercel.app/game/current?timeZone=${encodeURIComponent(
          timeZone
        )}`
      );
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

  if (error) {
    return "error";
  }

  function listOfGames() {
    return (
      <div className="game-list">
        {data.length > 0 &&
          data.map((game) => {
            return <GameBoxscore game={game} key={game._id} />;
          })}
        {data.length == 0 && (
          <div>
            <p>No games today</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div>{listOfGames()}</div>
    </div>
  );
};
