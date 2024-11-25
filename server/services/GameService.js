import db from "../db/connection.js";
import { DateTime } from "luxon";
import cron from "node-cron";

function getLocaLDay(utcDate, venueTimezone) {
  const localTime = DateTime.fromISO(utcDate, { zone: "utc" }).setZone(
    venueTimezone
  );
  const res = localTime.toISODate();
  return res;
}

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
          periodDescriptor: {
            number: 0,
            periodType: "REG",
            timeRemaining: "",
            inIntermission: false,
          },
          awayTeam: {
            abbrev: game.awayTeam.abbrev,
            commonName:
              game.awayTeam.commonName.default === "Utah Hockey Club"
                ? "Hockey Club"
                : game.awayTeam.commonName.default,
            placeName: game.awayTeam.placeName.default,
            logo: game.awayTeam.logo,
          },
          homeTeam: {
            abbrev: game.homeTeam.abbrev,
            commonName:
              game.homeTeam.commonName.default === "Utah Hockey Club"
                ? "Hockey Club"
                : game.homeTeam.commonName.default,
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
cron.schedule("0 0 * * 0", getSchedule);