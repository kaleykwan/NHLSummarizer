import express from "express";
import db from "../db/connection.js";
import { DateTime } from "luxon";

const router = express.Router();

router.get("/current", async (req, res) => {
  try {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = DateTime.now().setZone(userTimeZone);
    const currDate = now.toISODate();
    const yesterday = now.minus({ days: 1 }).toISODate();

    const collection = db.collection("games");
    const results = await collection
      .find({
        $or: [
          { date: currDate }, // Today's games
          { date: yesterday, gameState: { $in: ["LIVE"] } }, // Ongoing games from yesterday
        ],
      })
      .toArray();

    if (!results || results.length === 0) {
      return res.status(404).send("No games found");
    }

    res.status(200).send(results);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).send("An error occurred while fetching games");
  }
});

export default router;
