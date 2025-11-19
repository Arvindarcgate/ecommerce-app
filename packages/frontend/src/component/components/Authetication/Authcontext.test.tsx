
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, AuthContext } from "../../components/Authetication/Authcontext";

describe("AuthContext", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    // Helper wrapper to use AuthProvider in hooks
    const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;

    test("should load user from localStorage on mount", () => {
        const storedUser = { email: "stored@example.com" };
        localStorage.setItem("user", JSON.stringify(storedUser));

        const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

        expect(result.current.user).toEqual(storedUser);
    });

    test("login should update user and save to localStorage", async () => {
        const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

        await act(async () => {
            const response = await result.current.login("test@example.com", "123456");
            expect(response.success).toBe(true);
        });

        expect(result.current.user).toEqual({ email: "test@example.com" });
        expect(localStorage.getItem("user")).toBe(JSON.stringify({ email: "test@example.com" }));
    });

    test("login should fail if email or password missing", async () => {
        const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

        await act(async () => {
            const response = await result.current.login("", "");
            expect(response.success).toBe(false);
            expect(response.message).toBe("Invalid credentials");
        });

        expect(result.current.user).toBeNull();
    });

    test("signup should update user and save to localStorage", async () => {
        const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

        await act(async () => {
            const response = await result.current.signup("new@example.com", "password");
            expect(response.success).toBe(true);
        });

        expect(result.current.user).toEqual({ email: "new@example.com" });
        expect(localStorage.getItem("user")).toBe(JSON.stringify({ email: "new@example.com" }));
    });

    test("signup should fail when credentials missing", async () => {
        const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

        await act(async () => {
            const response = await result.current.signup("", "");
            expect(response.success).toBe(false);
            expect(response.message).toBe("Signup failed");
        });

        expect(result.current.user).toBeNull();
    });

    test("logout should clear user and remove from localStorage", () => {
        const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

        // Set user first
        act(() => {
            localStorage.setItem("user", JSON.stringify({ email: "logout@example.com" }));
            result.current.logout();
        });

        expect(result.current.user).toBeNull();
        expect(localStorage.getItem("user")).toBe(null);
    });

    test("provider should render children", () => {
        const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });

        expect(result.current).toBeDefined();
        expect(typeof result.current.login).toBe("function");
        expect(typeof result.current.logout).toBe("function");
        expect(typeof result.current.signup).toBe("function");
    });
});
