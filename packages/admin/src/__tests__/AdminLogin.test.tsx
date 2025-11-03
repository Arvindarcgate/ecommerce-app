// src/__tests__/AdminLogin.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminLogin from "../frontend/pages/Authetication/AdminLogin";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

global.alert = jest.fn();

describe("AdminLogin Component", () => {
    const renderWithRouter = () =>
        render(
            <BrowserRouter>
            <AdminLogin />
            </BrowserRouter>
        );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders email, password, and login button", () => {
        renderWithRouter();
        expect(screen.getByPlaceholderText(/Enter Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter Password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    });

    test("shows alert when fields are empty", () => {
        renderWithRouter();
        const button = screen.getByRole("button", { name: /Login/i });
        fireEvent.click(button);
        expect(global.alert).toHaveBeenCalledWith("Please fill all fields");
    });

    test("shows success alert when email and password filled", () => {
        renderWithRouter();
        fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), {
            target: { value: "admin@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), {
            target: { value: "password123" },
        });
        fireEvent.click(screen.getByRole("button", { name: /Login/i }));
        expect(global.alert).toHaveBeenCalledWith("Login successful!");
    });

    test("navigates to signup when 'Create New Account' clicked", () => {
        renderWithRouter();
        fireEvent.click(screen.getByText(/Create New Account/i));
        expect(mockNavigate).toHaveBeenCalledWith("/admin-signup");
    });
});
