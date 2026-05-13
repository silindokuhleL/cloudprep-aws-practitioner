import { describe, expect, it } from "vitest";
import { domains } from "./domains";
import { questions } from "./questions";

describe("study data", () => {
  it("uses the four CLF-C02 domains with 100 total exam weight", () => {
    expect(domains).toHaveLength(4);
    expect(domains.reduce((sum, domain) => sum + domain.examWeight, 0)).toBe(100);
  });

  it("gives every domain at least two topics", () => {
    expect(domains.every((domain) => domain.topics.length >= 2)).toBe(true);
  });

  it("has at least four questions for every exam domain", () => {
    for (const domain of domains) {
      expect(questions.filter((question) => question.domainId === domain.id).length).toBeGreaterThanOrEqual(4);
    }
  });

  it("expands to an 80-question original practice bank", () => {
    expect(questions).toHaveLength(80);
  });

  it("gives every question a valid correct option and explanations", () => {
    for (const question of questions) {
      const optionIds = question.options.map((option) => option.id);
      expect(question.correctOptionIds.length).toBeGreaterThan(0);
      expect(question.correctOptionIds.every((id) => optionIds.includes(id))).toBe(true);
      expect(question.options.every((option) => option.explanation.length > 20)).toBe(true);
      expect(question.remember.length).toBeGreaterThan(20);
    }
  });
});
