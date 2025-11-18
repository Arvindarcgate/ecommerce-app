import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthContext } from "../component/components/Authetication/Authcontext";

const mockAuthLoggedOut = {
  user: null,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
};

const mockAuthLoggedIn = {
  user: { name: "Arvind", email: "arvind@example.com" },
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
};

const renderNavbar = (authValue: any) =>
  render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </AuthContext.Provider>
  );

describe("Navbar Component", () => {
  // -------------------------------------------------
  test("renders logo text 'ECommerce'", () => {
    renderNavbar(mockAuthLoggedOut);
    expect(screen.getByText(/ECommerce/i)).toBeInTheDocument();
  });

  // -------------------------------------------------
  test("renders navigation links with correct paths", () => {
    renderNavbar(mockAuthLoggedOut);

    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/Home");
    expect(screen.getByText("Products").closest("a")).toHaveAttribute("href", "/productpage");
    expect(screen.getByText("Contact").closest("a")).toHaveAttribute("href", "/contact");
    expect(screen.getByText("Cart").closest("a")).toHaveAttribute("href", "/cart");
  });

  // -------------------------------------------------
  test("renders search bar and updates input value", () => {
    renderNavbar(mockAuthLoggedOut);

    const input = screen.getByPlaceholderText("Search products...");
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "Laptop" } });
    expect(input).toHaveValue("Laptop");
  });

  // -------------------------------------------------
  test("shows Login button when user is not logged in", () => {
    renderNavbar(mockAuthLoggedOut);

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  // -------------------------------------------------
  test("shows Logout button when user IS logged in", () => {
    renderNavbar(mockAuthLoggedIn);

    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  // -------------------------------------------------
  test("calls logout function when Logout button is clicked", () => {
    renderNavbar(mockAuthLoggedIn);

    const logoutBtn = screen.getByText(/Logout/i);
    fireEvent.click(logoutBtn);

    expect(mockAuthLoggedIn.logout).toHaveBeenCalledTimes(1);
  });

  // -------------------------------------------------
  test("shows username when logged in", () => {
    renderNavbar(mockAuthLoggedIn);

    expect(screen.getByText(/Hi, Arvind/i)).toBeInTheDocument();
  });
});
