import React from "react"; // Only needed for older React, but harmless
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";
import "@testing-library/jest-dom";

describe("Hero Component", () => {
  test("renders heading correctly", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Discover Amazing Products"
    );
  });

  test("renders description text", () => {
    render(<Hero />);
    expect(
      screen.getByText(/Shop the latest trends with unbeatable prices/)
    ).toBeInTheDocument();
  });

  test("renders both CTA buttons", () => {
    render(<Hero />);
    expect(
      screen.getByRole("button", { name: /Shop Now/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Browse Products/i })
    ).toBeInTheDocument();
  });
});
