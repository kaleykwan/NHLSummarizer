import express from "express";
import db from "../db/connection.js";
import { DateTime } from "luxon";

const router = express.Router();

// returns today's games
router.get("/today", async (req, res) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currDate = DateTime.now().setZone(userTimeZone).toISODate();
  let collection = db.collection("games");
  let results = await collection.find({ date: currDate }).toArray();
  if (!results) res.send("Error fetching today's games").status(404);
  else res.send(results).status(200);
});

// returns games that started yesterday (i.e at 10 pm) and are still on-going
router.get("/yesterday", async (req, res) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const yesterday = DateTime.now()
    .setZone(userTimeZone)
    .minus({ days: 1 })
    .toISODate();
  let collection = db.collection("games");
  let results = await collection
    .find({ date: yesterday, gameState: { $in: ["LIVE", "FINAL"] } })
    .toArray();

  if (!results) res.send("Error fetching yesterday's games").status(404);
  else res.send(results).status(200);
});

export default router;
