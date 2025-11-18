import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthContext, AuthProvider } from "./Authcontext";

// helper to access context inside tests
const TestConsumer = () => {
    const { user, login, signup, logout } = React.useContext(AuthContext);

    return (
        <div>
            <p data-testid="user">{user ? user.email : "null"}</p>
            <button data-testid="login-btn" onClick={() => login("test@example.com", "1234")} />
            <button data-testid="signup-btn" onClick={() => signup("new@example.com", "abcd")} />
            <button data-testid="logout-btn" onClick={() => logout()} />
        </div>
    );
};

// mock localStorage
beforeEach(() => {
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
});

describe("AuthContext", () => {
    test("loads user from localStorage", () => {
        (localStorage.getItem as jest.Mock).mockReturnValue(
            JSON.stringify({ email: "stored@example.com" })
        );

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect(screen.getByTestId("user").textContent).toBe("stored@example.com");
    });

    test("login sets user and stores in localStorage", async () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        screen.getByTestId("login-btn").click();

        await waitFor(() => {
            expect(screen.getByTestId("user").textContent).toBe("test@example.com");
        });

        expect(localStorage.setItem).toHaveBeenCalledWith(
            "user",
            JSON.stringify({ email: "test@example.com" })
        );
    });

    test("signup sets user and stores in localStorage", async () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        screen.getByTestId("signup-btn").click();

        await waitFor(() => {
            expect(screen.getByTestId("user").textContent).toBe("new@example.com");
        });

        expect(localStorage.setItem).toHaveBeenCalledWith(
            "user",
            JSON.stringify({ email: "new@example.com" })
        );
    });

    test("logout clears user and removes from localStorage", async () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        // simulate user already logged in
        screen.getByTestId("login-btn").click();

        await waitFor(() =>
            expect(screen.getByTestId("user").textContent).toBe("test@example.com")
        );

        // now logout
        screen.getByTestId("logout-btn").click();

        expect(screen.getByTestId("user").textContent).toBe("null");
        expect(localStorage.removeItem).toHaveBeenCalledWith("user");
    });
});
