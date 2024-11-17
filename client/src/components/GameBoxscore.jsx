import React from "react";
import TeamCard from "./TeamCard";
import "../styles/GameBoxscore.css";

const GameBoxscore = ({ game }) => {
  return (
    <div className="boxscore-wrapper">
      <div className="team-boxscore">
        <TeamCard team={game.awayTeam} />
        <p className="team-boxscore-goals">{game.boxscore.awayTeamScore}</p>
      </div>
      <p>-</p>
      <div className="team-boxscore">
        <TeamCard team={game.homeTeam} />
        <p className="team-boxscore-goals">{game.boxscore.homeTeamScore}</p>
      </div>
    </div>
  );
};

export default GameBoxscore;
