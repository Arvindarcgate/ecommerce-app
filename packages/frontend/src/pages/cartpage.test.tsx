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

        expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
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

        expect(screen.getByText("Shirt")).toBeInTheDocument();
        expect(screen.getByDisplayValue("2")).toBeInTheDocument();
    });

    // ---------------------------------------------------------------
    test("adds product passed via location.state", () => {
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

        expect(screen.getByText("Shoes")).toBeInTheDocument();
        expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    });

    // ---------------------------------------------------------------
    test("updates quantity when user changes input", () => {
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

        expect(screen.getByDisplayValue("3")).toBeInTheDocument();
    });

    // ---------------------------------------------------------------
    test("removes item on clicking remove button", () => {
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

        expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
    });

    // ---------------------------------------------------------------
    test("places final order successfully", async () => {
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

        const btn = screen.getByText("🏁 Final Order");
        fireEvent.click(btn);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:8000/api/orders/create",
                expect.any(Object)
            );
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
