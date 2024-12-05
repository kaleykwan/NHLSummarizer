import React from "react";
import TeamCard from "./TeamCard";
import "../styles/GameBoxscore.css";
import { DateTime } from "luxon";

const GameBoxscore = ({ game }) => {
  const { gameState, periodDescriptor, boxscore, awayTeam, homeTeam } = game;

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formattedTime = DateTime.fromISO(game.startTime, { zone: "utc" })
    .setZone(userTimeZone)
    .toFormat("h:mm a");

  const gameStateMetadata = () => {
    if (gameState === "FUT" || gameState === "PRE") {
      return <p className="boxscore-metadata-future">Today, {formattedTime}</p>;
    }
    if (gameState === "LIVE") {
      return <p className="boxscore-metadata-live">LIVE</p>;
    }
    if (["OFF", "FINAL"].includes(gameState)) {
      if (periodDescriptor.periodType === "REG") {
        return <p className="boxscore-metadata-final">FINAL</p>;
      } else {
        return (
          <p className="boxscore-metadata-final">
            FINAL/{periodDescriptor.periodType}
          </p>
        );
      }
    }
    return null;
  };

  const periodMetadata = () => {
    if (gameState === "LIVE" && !periodDescriptor.inIntermission) {
      if (periodDescriptor.periodType === "REG") {
        return (
          <p className="boxscore-metadata-time">
            P{periodDescriptor.number} - {periodDescriptor.timeRemaining}
          </p>
        );
      }
      if (periodDescriptor.periodType === "OT") {
        return (
          <p className="boxscore-metadata-time">
            OT - {periodDescriptor.timeRemaining}
          </p>
        );
      }
      if (periodDescriptor.periodType === "SO") {
        return <p className="boxscore-metadata-time">SO</p>;
      }
    }
    if (gameState === "LIVE" && periodDescriptor.inIntermission) {
      return (
        <p className="boxscore-metadata-time">
          {periodDescriptor.number === 1 ? "1st" : "2nd"} Intermission
        </p>
      );
    }
    return null;
  };

  const teamDivider = () => {
    if (gameState === "FUT" || gameState === "PRE") {
      return <p className="team-boxscore-vs">at</p>;
    }
    if (gameState !== "FUT" && gameState !== "PRE") {
      return <div className="team-boxscore-dash"></div>;
    }
    return null;
  };

  return (
    <div className="boxscore-wrapper">
      <div className="boxscore-metadata">
        {gameStateMetadata()}
        {periodMetadata()}
      </div>
      <div className="team-boxscore-wrapper">
        <div className="team-boxscore">
          <div>
            <TeamCard team={game.awayTeam} boxscore={game.boxscore} />
            {["LIVE", "FINAL", "OFF"].includes(gameState) && (
              <p className="team-boxscore-shots">
                Shots: {game.boxscore.awayTeamSOG}
              </p>
            )}
          </div>
          {["LIVE", "FINAL", "OFF"].includes(gameState) && (
            <p className="team-boxscore-goals">{game.boxscore.awayTeamScore}</p>
          )}
        </div>
        {teamDivider()}
        <div className="team-boxscore">
          {["LIVE", "FINAL", "OFF"].includes(gameState) && (
            <p className="team-boxscore-goals">{game.boxscore.homeTeamScore}</p>
          )}
          <div>
            <TeamCard team={game.homeTeam} boxscore={game.boxscore} />
            {["LIVE", "FINAL", "OFF"].includes(gameState) && (
              <p className="team-boxscore-shots">
                Shots: {game.boxscore.homeTeamSOG}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoxscore;
