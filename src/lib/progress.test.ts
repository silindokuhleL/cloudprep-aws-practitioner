import { describe, expect, it } from "vitest";
import { getReadinessState, getSkillState, recommendNextAction } from "./progress";

describe("progress rules", () => {
  it("starts new domains as new", () => {
    expect(getSkillState({ attempts: 0, correctPercent: 0, repeatedMistakes: 0, recentTrend: 0 })).toBe("new");
  });

  it("marks repeated mistakes as weak", () => {
    expect(getSkillState({ attempts: 8, correctPercent: 88, repeatedMistakes: 2, recentTrend: 10 })).toBe("weak");
  });

  it("marks stable high scores as strong", () => {
    expect(getSkillState({ attempts: 12, correctPercent: 86, repeatedMistakes: 0, recentTrend: 4 })).toBe("strong");
  });

  it("prioritises mistake review for daily recommendations", () => {
    expect(recommendNextAction({ hasMistakes: true, weakestDomainId: "security-compliance", allLessonsComplete: false }).kind).toBe("review-mistakes");
  });

  it("requires two strong mock exams for likely ready", () => {
    expect(getReadinessState([]).state).toBe("not-ready");
    expect(
      getReadinessState([
        { scorePercent: 82, domainScores: { "cloud-concepts": 80, "security-compliance": 78, "technology-services": 81, "billing-support": 75 } },
        { scorePercent: 86, domainScores: { "cloud-concepts": 85, "security-compliance": 80, "technology-services": 86, "billing-support": 76 } },
      ]).state,
    ).toBe("likely-ready");
  });
});
