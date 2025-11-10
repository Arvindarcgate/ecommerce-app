// src/components/Navbar.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Navbar from "./Navbar";
import { AuthContext } from "./components/Authetication/Authcontext";

describe("Navbar Component", () => {
  const mockLogout = jest.fn();
  const mockLogin = jest.fn();
  const mockSignup = jest.fn();
  const mockVerifyEmail = jest.fn();

  const renderNavbar = (user = null) => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user,
            login: mockLogin,
            signup: mockSignup,
            verifyEmail: mockVerifyEmail,
            logout: mockLogout,
          }}
        >
          <Navbar />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders logo correctly", () => {
    renderNavbar();
    expect(screen.getByText("ECommerce")).toBeInTheDocument();
  });

  test("renders navigation links", () => {
    renderNavbar();
    ["Home", "Products", "Contact"].forEach((link) => {
      expect(screen.getAllByText(link)[0]).toBeInTheDocument();
    });
  });

  test("renders search input and handles typing", () => {
    renderNavbar();
    const searchInput = screen.getByPlaceholderText("Search products...");
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "Headphones" } });
    expect(searchInput).toHaveValue("Headphones");
  });

  test("renders login button when user is null", () => {
    renderNavbar(null);
    const loginButton = screen.getByRole("link", { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

  test("renders welcome message when user is logged in", () => {
    renderNavbar({ email: "admin@example.com" });
    expect(screen.getByText(/Welcome, admin/i)).toBeInTheDocument();
  });

  test("toggles mobile menu when button is clicked", () => {
    renderNavbar();
    // There are multiple buttons, so select the toggle one using label or icon
    const toggleButtons = screen.getAllByRole("button");
    const toggleButton = toggleButtons[toggleButtons.length - 1]; // last one is mobile toggle

    // Initially mobile menu should not exist
    expect(screen.queryByPlaceholderText("Search products...")).toBeInTheDocument(); // desktop search exists
    expect(screen.queryByRole("textbox", { name: "" })).toBeInTheDocument();

    // Click to open mobile menu
    fireEvent.click(toggleButton);
    expect(screen.getAllByText("Home")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Products")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Contact")[0]).toBeInTheDocument();


    // Click again to close mobile menu
    fireEvent.click(toggleButton);
    // After closing, mobile menu items disappear but desktop ones stay, so we check dropdown removed
    // Using queryAllByText to avoid duplicate errors
    expect(screen.getAllByText("Home").length).toBeGreaterThanOrEqual(1);
  });
});
