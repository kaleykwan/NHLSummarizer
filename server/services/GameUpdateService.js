import db from "../db/connection.js";
import { DateTime } from "luxon";
import cron from "node-cron";

export default async function updateGames() {
  console.log("running update games");
  const now = DateTime.now().setZone("America/Los_Angeles");
  const currDate = now.toISODate();
  const yesterday = now.minus({ days: 1 }).toISODate();

  let collection = db.collection("games");
  const currGames = collection.find({
    $or: [
      { date: currDate },
      { date: yesterday, gameState: { $in: ["LIVE"] } },
    ],
  });

  for await (const game of currGames) {
    if (game.gameState === "FINAL" || game.gameState === "OFF") {
      continue;
    }
    const game_id = game.game_id;
    const res = await fetch(
      `https://api-web.nhle.com/v1/gamecenter/${game_id}/boxscore`
    );
    const gameInfo = await res.json();
    if (gameInfo.gameState === "FUT" || gameInfo.gameState === "PRE") {
      continue;
    }
    await collection.updateOne(
      { game_id: game_id },
      {
        $set: {
          "boxscore.awayTeamScore": gameInfo.awayTeam.score,
          "boxscore.homeTeamScore": gameInfo.homeTeam.score,
          "boxscore.awayTeamSOG": gameInfo.awayTeam.sog
            ? gameInfo.awayTeam.sog
            : 0,
          "boxscore.homeTeamSOG": gameInfo.homeTeam.sog
            ? gameInfo.homeTeam.sog
            : 0,
          "boxscore.overtime": gameInfo.gameOutcome
            ? gameInfo.gameOutcome.lastPeriodType === "OT"
            : false,
          "periodDescriptor.number": gameInfo.periodDescriptor
            ? gameInfo.periodDescriptor.number
            : 0,
          "periodDescriptor.periodType": gameInfo.periodDescriptor
            ? gameInfo.periodDescriptor.periodType
            : "REG",
          "periodDescriptor.timeRemaining": gameInfo.clock.timeRemaining,
          "periodDescriptor.inIntermission": gameInfo.clock.inIntermission,
          gameState:
            gameInfo.gameState === "CRIT" ? "LIVE" : gameInfo.gameState,
        },
      }
    );
  }
}

cron.schedule("*/2 * * * *", updateGames);
