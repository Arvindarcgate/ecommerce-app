// src/components/Newsletter.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Newsletter from "./NewsLetter";
import { useSubscribeNewsletter } from "../../../hook/useSubscribeNewsletter";
import { toast } from "react-hot-toast";

// --- Mock external modules ---
jest.mock("../../../hook/useSubscribeNewsletter");
jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Newsletter Component", () => {
  const mockMutate = jest.fn();
  const mockUseSubscribeNewsletter = useSubscribeNewsletter as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSubscribeNewsletter.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  test("renders heading and description", () => {
    render(<Newsletter />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Stay Updated"
    );
    expect(
      screen.getByText(/Subscribe to our newsletter and be the first to know/i)
    ).toBeInTheDocument();
  });

  test("renders email input and subscribe button", () => {
    render(<Newsletter />);
    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");

    const button = screen.getByRole("button", { name: /Subscribe/i });
    expect(button).toBeInTheDocument();
  });

  test("calls mutate on valid email submit", async () => {
    render(<Newsletter />);
    const input = screen.getByPlaceholderText("Enter your email");
    const button = screen.getByRole("button", { name: /Subscribe/i });

    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith("test@example.com", expect.any(Object));
    });
  });

  test("shows success toast when mutation succeeds", async () => {
    mockMutate.mockImplementation((_, { onSuccess }) => {
      onSuccess({ message: "Subscribed successfully!" });
    });

    render(<Newsletter />);
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Subscribe/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Subscribed successfully!");
    });
  });

  test("shows error toast when mutation fails", async () => {
    mockMutate.mockImplementation((_, { onError }) => {
      onError(new Error("Subscription failed"));
    });

    render(<Newsletter />);
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Subscribe/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Subscription failed");
    });
  });

  test("disables input and button when isPending is true", () => {
    mockUseSubscribeNewsletter.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<Newsletter />);
    const input = screen.getByPlaceholderText("Enter your email");
    const button = screen.getByRole("button");

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });
});
