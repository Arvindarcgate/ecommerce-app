import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthContext } from "../component/components/Authetication/Authcontext";

describe("Navbar Component", () => {
  test("renders logo and navigation links", () => {
    render(
      <AuthContext.Provider
        value={{
          user: null,
          login: jest.fn(),
          signup: jest.fn(),
          logout: jest.fn(),
        }}
      >
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText("ECommerce")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  test("renders user dropdown when logged in", () => {
    const mockUser = { email: "test@example.com" };
    const mockLogout = jest.fn();

    render(
      <AuthContext.Provider
        value={{
          user: mockUser,
          login: jest.fn(),
          signup: jest.fn(),
          logout: mockLogout,
        }}
      >
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const userText = screen.getByText(/Welcome, test/i);
    fireEvent.click(userText);

    expect(screen.getByText("User Details")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });
});
