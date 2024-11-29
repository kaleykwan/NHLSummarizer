vi.mock("../db/connection.js", () => ({
  default: {
    collection: vi.fn(() => ({
      insertOne: vi.fn(),
    })),
  },
}));

import getSchedule from "../services/GameService";
import { describe, it, expect, vi, beforeEach } from "vitest";
import db from "../db/connection.js";

global.fetch = vi.fn();

describe("getSchedule", () => {
  let mockDb;
  let mockCollection;

  beforeEach(() => {
    console.log(db);
    mockDb = db;
    mockCollection = mockDb.collection();
    vi.clearAllMocks();
  });

  it("should fetch the NHL schedule and save games to NHL database", async () => {
    fetch.mockResolvedValue({
      json: async () => ({
        gameWeek: [
          {
            games: [
              {
                id: 123,
                venueTimezone: "America/Los Angeles",
                startTimeUTC: "2024-11-22T00:00:00Z",
                season: "2024",
                gameType: "REG",
                venue: { default: "Sample Venue" },
                gameState: "PRE",
                awayTeam: {
                  abbrev: "AWY",
                  commonName: { default: "Away Team" },
                  placeName: { default: "Away Place" },
                  logo: "away-logo.png",
                },
                homeTeam: {
                  abbrev: "HOM",
                  commonName: { default: "Home Team" },
                  placeName: { default: "Home Place" },
                  logo: "home-logo.png",
                },
              },
            ],
          },
        ],
      }),
    });

    await getSchedule();

    expect(fetch).toHaveBeenCalledWith(
      "https://api-web.nhle.com/v1/schedule/now"
    );
    expect(mockCollection.insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        game_id: "123",
        season: "2024",
        gameState: "PRE",
      })
    );
  });

  it("should handle errors gracefully", async () => {
    fetch.mockRejectedValue(new Error("Failed to fetch game schedule"));

    await expect(getSchedule()).rejects.toThrow(
      "Failed to fetch game schedule"
    );

    expect(mockCollection.insertOne).not.toHaveBeenCalled();
  });
});
