import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { JoinFaq } from "@/components/sections/join/JoinFaq";
import { joinFaq } from "@/data/join";

describe("JoinFaq", () => {
  it("abre uma pergunta por vez", async () => {
    const user = userEvent.setup();
    render(<JoinFaq />);
    const [first, second] = joinFaq;

    const firstButton = screen.getByRole("button", { name: first.question });
    const secondButton = screen.getByRole("button", { name: second.question });
    expect(firstButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(first.answer)).toBeInTheDocument();

    await user.click(secondButton);

    expect(secondButton).toHaveAttribute("aria-expanded", "true");
    expect(firstButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("region", { name: second.question })).toHaveTextContent(second.answer);
  });

  it("fecha a pergunta aberta ao clicar nela de novo", async () => {
    const user = userEvent.setup();
    render(<JoinFaq />);
    const button = screen.getByRole("button", { name: joinFaq[0].question });

    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});
