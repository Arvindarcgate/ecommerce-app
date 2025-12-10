import React from "react";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, AuthContext } from "../Authetication/Authcontext";

const TestConsumer = () => (
    <AuthContext.Consumer>
        {(value) => (
            <div>
                <span data-testid="user">
                    {value.user ? value.user.email : "null"}
                </span>

                <button data-testid="login-btn" onClick={() => value.login("test@example.com", "1234")}>
                    Login
                </button>

                <button data-testid="signup-btn" onClick={() => value.signup("new@example.com", "1234")}>
                    Signup
                </button>

                <button data-testid="logout-btn" onClick={value.logout}>
                    Logout
                </button>

                <button data-testid="login-fail-btn" onClick={() => value.login("", "")}>
                    Login Fail
                </button>

                <button data-testid="signup-fail-btn" onClick={() => value.signup("", "")}>
                    Signup Fail
                </button>
            </div>
        )}
    </AuthContext.Consumer>
);

describe("AuthContext – 100% Coverage", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.restoreAllMocks();
    });

    test("loads user from localStorage & handles JSON.parse error", () => {
     
        localStorage.setItem("user", "{ invalid json }");
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect(screen.getByTestId("user").textContent).toBe("null");
        expect(consoleSpy).toHaveBeenCalled();
    });

    test("login updates user and localStorage", async () => {
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

    test("login fails with empty credentials", async () => {
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

    test("signup updates user and localStorage", async () => {
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

    test("signup fails with empty credentials", async () => {
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

    test("logout clears user and localStorage", async () => {
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
