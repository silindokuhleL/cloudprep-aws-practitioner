import { describe, expect, it } from "vitest";
import { checkAnswer, getReviewDueDate, scoreQuiz } from "./scoring";

describe("scoring", () => {
  it("marks a single-answer question correct only when the selected answer matches", () => {
    expect(checkAnswer(["b"], ["b"])).toBe(true);
    expect(checkAnswer(["a"], ["b"])).toBe(false);
  });

  it("marks multiple-response answers correct only when all selected answers match", () => {
    expect(checkAnswer(["a", "c"], ["c", "a"])).toBe(true);
    expect(checkAnswer(["a"], ["a", "c"])).toBe(false);
    expect(checkAnswer(["a", "b", "c"], ["a", "c"])).toBe(false);
  });

  it("scores a quiz as a percentage", () => {
    expect(scoreQuiz([{ correct: true }, { correct: false }, { correct: true }])).toBe(67);
  });

  it("schedules weak answers sooner than understood answers", () => {
    const createdAt = new Date("2026-05-13T00:00:00.000Z");
    expect(getReviewDueDate({ correct: false, uncertain: false, confidence: "needs-relearning", createdAt })).toBe("2026-05-13T00:00:00.000Z");
    expect(getReviewDueDate({ correct: true, uncertain: false, confidence: "guessed", createdAt })).toBe("2026-05-14T00:00:00.000Z");
    expect(getReviewDueDate({ correct: true, uncertain: false, confidence: "understood", createdAt })).toBe("2026-05-20T00:00:00.000Z");
  });
});
