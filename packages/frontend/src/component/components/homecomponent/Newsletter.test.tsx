// src/components/Newsletter.test.tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Newsletter from "./NewsLetter";

// describe("Newsletter Component", () => {
//   beforeEach(() => {
//     render(<Newsletter />);
//   });

//   test("renders heading", () => {
//     expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
//       "Stay Updated"
//     );
//   });

//   test("renders description text", () => {
//     expect(
//       screen.getByText(/Subscribe to our newsletter and be the first to know/i)
//     ).toBeInTheDocument();
//   });

//   test("renders email input field", () => {
//     const input = screen.getByPlaceholderText("Enter your email");
//     expect(input).toBeInTheDocument();
//     expect(input).toHaveAttribute("type", "email");
//   });

//   test("renders subscribe button", () => {
//     const button = screen.getByRole("button", { name: /Subscribe/i });
//     expect(button).toBeInTheDocument();
//   });
// });

describe("Newsletter Component", () => {
  beforeEach(() => {
    render(<Newsletter />);
  });

  test("renders heading", () => {
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Stay Updated"
    );
  });

  test("renders description text", () => {
    expect(
      screen.getByText(/Subscribe to our newsletter and be the first to know/i)
    ).toBeInTheDocument();
  });

  test("renders email input field", () => {
    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
  });

  test("renders subscribe button", () => {
    const button = screen.getByRole("button", { name: /Subscribe/i });
    expect(button).toBeInTheDocument();
  });
});
