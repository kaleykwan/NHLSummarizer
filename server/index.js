import express from "express";
import cors from "cors";
import games from "./routes/game.js";
import getSchedule from "./services/GameService.js";
import updateGames from "./services/GameUpdateService.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(
  cors({
    origin: ["https://nhl-summarizer.vercel.app", "http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/game", games);

app.get("/", (req, res) => {
  res.json("Hello");
});

app.get("/schedule", async (req, res) => {
  try {
    await getSchedule();
    res.status(200).json({ message: "Schedule updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update schedule" });
  }
});

app.get("/update-games", async (req, res) => {
  try {
    await updateGames();
    res.status(200).json({ message: "Games updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update games" });
  }
});

export default app;
