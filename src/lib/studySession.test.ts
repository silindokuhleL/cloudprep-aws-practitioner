import { describe, expect, it } from "vitest";
import { formatDuration, getElapsedSeconds, getRemainingSeconds } from "./studySession";

describe("study session helpers", () => {
  it("adds running elapsed time to accumulated time", () => {
    expect(
      getElapsedSeconds(
        {
          running: true,
          startedAt: "2026-05-13T10:00:00.000Z",
          accumulatedSeconds: 120,
          activeDate: "2026-05-13",
        },
        new Date("2026-05-13T10:05:00.000Z"),
      ),
    ).toBe(420);
  });

  it("formats short and long durations", () => {
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(3665)).toBe("1:01:05");
  });

  it("calculates remaining target seconds", () => {
    expect(getRemainingSeconds(60, 15 * 60)).toBe(45 * 60);
    expect(getRemainingSeconds(60, 80 * 60)).toBe(0);
  });
});
