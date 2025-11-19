import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminLogin from "../frontend/pages/Authetication/AdminLogin";

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedNavigate,
}));

// Mock alert
global.alert = jest.fn();

// Mock fetch
global.fetch = jest.fn();

describe("AdminLogin Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders Admin Login title", () => {
        render(
            <MemoryRouter>
                <AdminLogin />
            </MemoryRouter>
        );

        expect(screen.getByText("Admin Login")).toBeInTheDocument();
    });

    test("shows alert if fields are empty", () => {
        render(
            <MemoryRouter>
                <AdminLogin />
            </MemoryRouter>
        );

        const form = screen.getByRole("form"); // custom role added below

        fireEvent.submit(form);

        expect(global.alert).toHaveBeenCalledWith("Please fill all fields");
    });

    test("updates email and password inputs", () => {
        render(
            <MemoryRouter>
                <AdminLogin />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText("Enter Email");
        const passwordInput = screen.getByPlaceholderText("Enter Password");

        fireEvent.change(emailInput, { target: { value: "admin@test.com" } });
        fireEvent.change(passwordInput, { target: { value: "123456" } });

        expect(emailInput).toHaveValue("admin@test.com");
        expect(passwordInput).toHaveValue("123456");
    });

    test("successful login triggers navigation + localStorage", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: "test-token" }),
        });

        render(
            <MemoryRouter>
                <AdminLogin />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Enter Email"), {
            target: { value: "admin@test.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
            target: { value: "123456" },
        });

        const form = screen.getByRole("form");
        fireEvent.submit(form);

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("Admin Login Successful!");
            expect(localStorage.getItem("token")).toBe("test-token");
            expect(mockedNavigate).toHaveBeenCalledWith("/admin-dashboard");
        });
    });

    test("shows alert on failed login", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: "Invalid credentials" }),
        });

        render(
            <MemoryRouter>
                <AdminLogin />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Enter Email"), {
            target: { value: "wrong@test.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
            target: { value: "wrong123" },
        });

        const form = screen.getByRole("form");
        fireEvent.submit(form);

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("Invalid credentials");
        });
    });

    test("clicking on signup text navigates to /admin-signup", () => {
        render(
            <MemoryRouter>
                <AdminLogin />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Create New Account"));

        expect(mockedNavigate).toHaveBeenCalledWith("/admin-signup");
    });
});
