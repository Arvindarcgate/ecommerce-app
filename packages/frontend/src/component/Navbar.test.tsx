import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthContext } from "../component/components/Authetication/Authcontext";

// Helper wrapper for rendering with Router + AuthContext
const renderNavbar = (authValue: any) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={authValue}>
        <Navbar />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe("Navbar Component", () => {
  test("renders Navbar with links", () => {
    renderNavbar({ user: null, logout: jest.fn() });

    expect(screen.getByText("ECommerce")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("Cart")).toBeInTheDocument();
  });

  test("renders Login button when user is not logged in", () => {
    renderNavbar({ user: null, logout: jest.fn() });
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("shows user email prefix when logged in", () => {
    renderNavbar({
      user: { email: "testuser@example.com" },
      logout: jest.fn(),
    });

    expect(screen.getByText("Welcome, testuser ▼")).toBeInTheDocument();
  });

  test("dropdown opens when clicking user text", () => {
    renderNavbar({
      user: { email: "john@example.com" },
      logout: jest.fn(),
    });

    const userText = screen.getByText("Welcome, john ▼");
    fireEvent.click(userText);

    const dropdown = screen.getByTestId("dropdown-menu");
    expect(dropdown).toBeInTheDocument();
  });

  test("logout function is called when clicking logout", () => {
    const mockLogout = jest.fn();

    renderNavbar({
      user: { email: "john@example.com" },
      logout: mockLogout,
    });

    fireEvent.click(screen.getByText("Welcome, john ▼"));

    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  test("search input updates correctly", () => {
    renderNavbar({ user: null, logout: jest.fn() });

    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "Laptop" } });

    expect(searchInput).toHaveValue("Laptop");
  });
});
