import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MockExam } from "./MockExam";

describe("MockExam", () => {
  it("runs a 65-question mock exam and saves a result", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<MockExam onComplete={onComplete} />);

    expect(screen.getByText("65-question mock exam")).toBeInTheDocument();
    await user.click(screen.getByLabelText(/Variable expense/i));
    await user.click(screen.getByRole("button", { name: /Submit Exam/i }));

    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.getByText(/Mock exam submitted/i)).toBeInTheDocument();
  });
});
