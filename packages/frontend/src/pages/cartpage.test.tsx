import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CartPage from "./cartpage";
import { MemoryRouter } from "react-router-dom";

// --- Mock navigate ---
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

// --- Mock fetch ---
global.fetch = jest.fn();

// --- Mock localStorage ---
function mockLocalStorage(data: any = {}) {
    const store = { ...data };

    jest.spyOn(window.localStorage.__proto__, "getItem").mockImplementation(
        (key: string) => store[key] || null
    );

    jest.spyOn(window.localStorage.__proto__, "setItem").mockImplementation(
        (key: string, value: string) => {
            store[key] = value;
        }
    );

    jest.spyOn(window.localStorage.__proto__, "removeItem").mockImplementation(
        (key: string) => {
            delete store[key];
        }
    );

    return store;
}

describe("CartPage Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ---------------------------------------------------------------
    test("renders empty cart when no items", () => {
        mockLocalStorage({ user: JSON.stringify({ email: "guest@example.com" }) });

        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        const empty = screen.getByText("Your cart is empty.");
        expect(empty).toBeTruthy();
    });

    // ---------------------------------------------------------------
    test("loads existing cart items from localStorage", () => {
        const cartData = [
            {
                id: 1,
                name: "Shirt",
                price: 500,
                size: "M",
                image: "/shirt.jpg",
                quantity: 2,
            },
        ];

        mockLocalStorage({
            cart: JSON.stringify(cartData),
            user: JSON.stringify({ email: "guest@example.com" }),
        });

        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        expect(screen.getByText("Shirt")).toBeTruthy();
        expect(screen.getByDisplayValue("2")).toBeTruthy();
    });

    // ---------------------------------------------------------------
    test("adds product via location.state", () => {
        mockLocalStorage({ user: JSON.stringify({ email: "guest@example.com" }) });

        const product = {
            id: 2,
            name: "Shoes",
            price: 1000,
            size: "9",
            image: "/shoes.jpg",
            quantity: 1,
        };

        render(
            <MemoryRouter initialEntries={[{ pathname: "/cart", state: { product } }]}>
                <CartPage />
            </MemoryRouter>
        );

        expect(screen.getByText("Shoes")).toBeTruthy();
        expect(screen.getByDisplayValue("1")).toBeTruthy();
    });

    // ---------------------------------------------------------------
    test("updates quantity", () => {
        const cartData = [
            {
                id: 1,
                name: "Shirt",
                price: 500,
                size: "M",
                image: "/shirt.jpg",
                quantity: 1,
            },
        ];

        mockLocalStorage({
            cart: JSON.stringify(cartData),
            user: JSON.stringify({ email: "guest@example.com" }),
        });

        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        const qtyInput = screen.getByDisplayValue("1");
        fireEvent.change(qtyInput, { target: { value: "3" } });

        expect(screen.getByDisplayValue("3")).toBeTruthy();
    });

    // ---------------------------------------------------------------
    test("removes item", () => {
        const cartData = [
            {
                id: 1,
                name: "Shirt",
                price: 500,
                size: "M",
                image: "/shirt.jpg",
                quantity: 1,
            },
        ];

        mockLocalStorage({
            cart: JSON.stringify(cartData),
            user: JSON.stringify({ email: "guest@example.com" }),
        });

        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("❌ Remove"));

        expect(screen.getByText("Your cart is empty.")).toBeTruthy();
    });

    // ---------------------------------------------------------------
    test("places final order", async () => {
        const cartData = [
            {
                id: 1,
                name: "Shirt",
                price: 500,
                size: "M",
                image: "/shirt.jpg",
                quantity: 2,
            },
        ];

        mockLocalStorage({
            cart: JSON.stringify(cartData),
            user: JSON.stringify({ email: "test@gmail.com" }),
        });

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ orderId: "ABC123" }),
        });

        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("🏁 Final Order"));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
        });
    });

    // ---------------------------------------------------------------
    test("logout navigates to login", () => {
        mockLocalStorage({
            user: JSON.stringify({ email: "abc@gmail.com" }),
        });

        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("🚪 Logout"));

        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
});
