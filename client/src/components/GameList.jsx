import React from "react";
import { useQuery } from "@tanstack/react-query";
import GameBoxscore from "./GameBoxscore.jsx";
import "../styles/GameList.css";

export const GameList = () => {
  const { isPending, data, error } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      // const response = await fetch(
      //   `${process.env.REACT_APP_BACKEND_URL}/game/current/`
      // );
      const response = await fetch(
        `https://nhl-summarizer-backend.vercel.app/game/current/`
      );
      // const response = await fetch("http://localhost:5050/game/current/");
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
      <div>
        {data &&
          data.map((game) => {
            return <GameBoxscore game={game} key={game._id} />;
          })}
      </div>
    );
  }

  return (
    <div>
      <div className="game-list">{listOfGames()}</div>
    </div>
  );
};
