import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminSignup from "../frontend/pages/Authetication/adminsignup";

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

describe("AdminSignup Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders Admin Signup title", () => {
        render(
            <MemoryRouter>
                <AdminSignup />
            </MemoryRouter>
        );

        expect(screen.getByText("Admin Signup")).toBeInTheDocument();
    });

    test("shows alert if fields are empty", () => {
        render(
            <MemoryRouter>
                <AdminSignup />
            </MemoryRouter>
        );

        const form = screen.getByRole("form");
        fireEvent.submit(form);

        expect(global.alert).toHaveBeenCalledWith("Please fill all fields");
    });

    test("updates name, email and password inputs", () => {
        render(
            <MemoryRouter>
                <AdminSignup />
            </MemoryRouter>
        );

        const nameInput = screen.getByPlaceholderText("Enter Name");
        const emailInput = screen.getByPlaceholderText("Enter Email");
        const passwordInput = screen.getByPlaceholderText("Enter Password");

        fireEvent.change(nameInput, { target: { value: "Admin User" } });
        fireEvent.change(emailInput, { target: { value: "admin@test.com" } });
        fireEvent.change(passwordInput, { target: { value: "123456" } });

        expect(nameInput).toHaveValue("Admin User");
        expect(emailInput).toHaveValue("admin@test.com");
        expect(passwordInput).toHaveValue("123456");
    });

    test("successful signup navigates to admin login + saves token", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: "signup-token" }),
        });

        render(
            <MemoryRouter>
                <AdminSignup />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Enter Name"), {
            target: { value: "Admin User" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter Email"), {
            target: { value: "admin@test.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
            target: { value: "123456" },
        });

        const form = screen.getByRole("form");
        fireEvent.submit(form);

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith(
                "Admin Account Created Successfully!"
            );
            expect(localStorage.getItem("token")).toBe("signup-token");
            expect(mockedNavigate).toHaveBeenCalledWith("/admin-login");
        });
    });

    test("shows alert when signup fails", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: "Signup failed" }),
        });

        render(
            <MemoryRouter>
                <AdminSignup />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Enter Name"), {
            target: { value: "Admin User" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter Email"), {
            target: { value: "admin@test.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
            target: { value: "123456" },
        });

        const form = screen.getByRole("form");
        fireEvent.submit(form);

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("Signup failed");
        });
    });

    test("click on Login Here navigates to /admin-login", () => {
        render(
            <MemoryRouter>
                <AdminSignup />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Login Here"));
        expect(mockedNavigate).toHaveBeenCalledWith("/admin-login");
    });
});
