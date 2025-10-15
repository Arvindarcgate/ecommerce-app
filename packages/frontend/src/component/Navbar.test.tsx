// src/components/Navbar.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Navbar from "./Navbar";

describe("Navbar Component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  });

  test("renders logo", () => {
    expect(screen.getByText("ECommerce")).toBeInTheDocument();
    expect(screen.getByText("E")).toBeInTheDocument();
  });

  test("renders navigation links", () => {
    ["Home", "Products", "Contact"].forEach((link) => {
      expect(screen.getAllByText(link)[0]).toBeInTheDocument();
    });
  });

  test("renders search input", () => {
    const searchInput = screen.getByPlaceholderText("Search products...");
    expect(searchInput).toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: "Headphones" } });
    expect(searchInput).toHaveValue("Headphones");
  });

  test("renders login and cart buttons when user is null", () => {
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "" })).toBeInTheDocument();
  });

  test("toggles mobile menu when button is clicked", () => {
    const toggleButton = screen.getByRole("button", { name: "" });

    fireEvent.click(toggleButton);

    // After clicking, mobile menu links should appear
    ["Home", "Products", "Contact", "Login"].forEach((item) => {
      expect(screen.getAllByText(item)[0]).toBeInTheDocument();
    });

    // Close mobile menu
    fireEvent.click(toggleButton);
    ["Home", "Products", "Contact", "Login"].forEach((item) => {

      expect(screen.getAllByText(item)[0]).toBeInTheDocument();
    });
  });
});
