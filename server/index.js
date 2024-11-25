import express from "express";
import cors from "cors";
import games from "./routes/game.js";
// import getSchedule from "./services/GameService.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(
  cors({
    origin: "https://nhl-summarizer.vercel.app",
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/game", games);

app.get("/", (req, res) => {
  res.json("Hello");
});

// start the Express server
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

export default app;
