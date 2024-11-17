import db from "../db/connection.js";
import { DateTime } from "luxon";
import cron from "node-cron";

// get the date in the venue's timezone
function getLocaLDay(utcDate, venueTimezone) {
  const localTime = DateTime.fromISO(utcDate, { zone: "utc" }).setZone(
    venueTimezone
  );
  const res = localTime.toISODate();
  return res;
}

// get the start time (HH:mm am/pm) in the venue's timezone
// function getLocalStartTime(utcDate, venueTimezone) {
//   const formattedTime = DateTime.fromISO(utcDate, { zone: "utc" })
//     .setZone(venueTimezone)
//     .toFormat("h:mm a");
//   return formattedTime;
// }

export default async function getSchedule() {
  const res = await fetch("https://api-web.nhle.com/v1/schedule/now");
  const schedule = await res.json();
  const gameWeek = schedule.gameWeek;

  let collection = db.collection("games");
  for (let day of gameWeek) {
    for (let game of day.games) {
      try {
        let newGame = {
          game_id: game.id,
          date: getLocaLDay(game.startTimeUTC, game.venueTimezone),
          startTime: game.startTimeUTC,
          season: game.season,
          gameType: game.gameType,
          venue: game.venue.default,
          gameState: game.gameState,
          awayTeam: {
            abbrev: game.awayTeam.abbrev,
            commonName: game.awayTeam.commonName.default,
            placeName: game.awayTeam.placeName.default,
            logo: game.awayTeam.logo,
          },
          homeTeam: {
            abbrev: game.homeTeam.abbrev,
            commonName: game.homeTeam.commonName.default,
            placeName: game.homeTeam.placeName.default,
            logo: game.homeTeam.logo,
          },
          boxscore: {
            awayTeamScore: 0,
            homeTeamScore: 0,
            awayTeamSOG: 0,
            homeTeamSOG: 0,
            overtime: false,
          },
        };
        await collection.insertOne(newGame);
      } catch (err) {
        console.log(err);
      }
    }
  }
}

async function updateGames() {
  console.log("running update games");
  const currDate = DateTime.now().setZone("America/Los_Angeles").toISODate();

  let collection = db.collection("games");
  const currGames = collection.find({ date: currDate });

  for await (const game of currGames) {
    if (game.gameState === "OFF") {
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
          "boxscore.awayTeamSOG": gameInfo.awayTeam.sog,
          "boxscore.homeTeamSOG": gameInfo.homeTeam.sog,
          "boxscore.overtime": gameInfo.gameOutcome
            ? gameInfo.gameOutcome.lastPeriodType === "OT"
            : false,
          gameState: gameInfo.gameState,
        },
      }
    );
  }
}

cron.schedule("0 0 * * 0", getSchedule);
cron.schedule("*/5 * * * *", updateGames);
