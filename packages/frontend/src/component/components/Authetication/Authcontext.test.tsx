import React from "react";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, AuthContext } from "../Authetication/Authcontext";

const TestConsumer = () => (
    <AuthContext.Consumer>
        {(value) => (
            <div>
                <span data-testid="user">{value.user ? value.user.email : "null"}</span>
                <button onClick={() => value.logout()} data-testid="logout-btn">Logout</button>
                <button onClick={() => value.login("test@example.com", "1234")} data-testid="login-btn">
                    Login
                </button>
                <button onClick={() => value.signup("new@example.com", "1234")} data-testid="signup-btn">
                    Signup
                </button>
                <button onClick={() => value.login("", "")} data-testid="login-fail-btn">
                    Login Fail
                </button>
                <button onClick={() => value.signup("", "")} data-testid="signup-fail-btn">
                    Signup Fail
                </button>
            </div>
        )}
    </AuthContext.Consumer>
);

describe("AuthContext – 100% Coverage", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    test("loads user from localStorage & covers catch block", () => {
        // Force parse error and spy
        localStorage.setItem("user", "{ bad json }"); // invalid JSON
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        // User should be null after failed parse
        expect(screen.getByTestId("user").textContent).toBe("null");

        // Ensure catch block ran
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });

    test("login updates user & localStorage", async () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await act(async () => {
            screen.getByTestId("login-btn").click();
        });

        expect(screen.getByTestId("user").textContent).toBe("test@example.com");
        expect(JSON.parse(localStorage.getItem("user")!)).toEqual({ email: "test@example.com" });
    });

    test("login fails with invalid credentials", async () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await act(async () => {
            screen.getByTestId("login-fail-btn").click();
        });

        expect(screen.getByTestId("user").textContent).toBe("null");
    });

    test("signup updates user & localStorage", async () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await act(async () => {
            screen.getByTestId("signup-btn").click();
        });

        expect(screen.getByTestId("user").textContent).toBe("new@example.com");
        expect(JSON.parse(localStorage.getItem("user")!)).toEqual({ email: "new@example.com" });
    });

    test("signup fails with invalid credentials", async () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await act(async () => {
            screen.getByTestId("signup-fail-btn").click();
        });

        expect(screen.getByTestId("user").textContent).toBe("null");
    });

    test("logout clears user & localStorage", async () => {
        localStorage.setItem("user", JSON.stringify({ email: "already@example.com" }));

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await act(async () => {
            screen.getByTestId("logout-btn").click();
        });

        expect(screen.getByTestId("user").textContent).toBe("null");
        expect(localStorage.getItem("user")).toBeNull();
    });
});
