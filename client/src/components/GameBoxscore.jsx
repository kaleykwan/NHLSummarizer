import React from "react";
import TeamCard from "./TeamCard";
import "../styles/GameBoxscore.css";
import { DateTime } from "luxon";

const GameBoxscore = ({ game }) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formattedTime = DateTime.fromISO(game.startTime, { zone: "utc" })
    .setZone(userTimeZone)
    .toFormat("h:mm a");

  return (
    <div className="boxscore-wrapper">
      <div className="boxscore-metadata">
        {game.gameState === "FUT" && (
          <p className="boxscore-metadata-future">Today, {formattedTime}</p>
        )}
        {game.gameState === "LIVE" && (
          <p className="boxscore-metadata-live">LIVE</p>
        )}
        {game.gameState === "FINAL" && (
          <p className="boxscore-metadata-final">FINAL</p>
        )}
        {game.gameState === "LIVE" && (
          <p>
            P{game.periodDescriptor.number},
            {game.periodDescriptor.timeRemaining}
          </p>
        )}
      </div>
      <div className="team-boxscore-wrapper">
        <div className="team-boxscore">
          <TeamCard team={game.awayTeam} boxscore={game.boxscore}/>
          <p className="team-boxscore-goals">
            {game.boxscore.awayTeamScore}
          </p>
        </div>
        {game.gameState != "FUT" && <p className="team-boxscore-vs">-</p>}
        {game.gameState === "FUT" && <p className="team-boxscore-vs">at</p>}
        <div className="team-boxscore">
          <p className="team-boxscore-goals">
            {game.boxscore.homeTeamScore}
          </p>
          <TeamCard team={game.homeTeam} boxscore={game.boxscore}/>
        </div>
      </div>
    </div>
  );
};

export default GameBoxscore;
