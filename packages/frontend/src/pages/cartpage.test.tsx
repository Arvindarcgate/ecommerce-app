import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CartPage from "./cartpage";

// Mock navigate
const mockNavigate = jest.fn();

// 🧩 Mock react-router-dom once (top-level)
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
    useLocation: () => ({
        state: {
            product: {
                id: 1,
                name: "Test Product",
                price: 100,
                size: "M",
                image: "/test.jpg",
                quantity: 1,
            },
        },
    }),
}));

// 🧩 Setup global mocks
beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();

    // Mock fetch to resolve quickly
    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ orderId: "ORD123" }),
    });

    // Mock alert so no browser popup
    window.alert = jest.fn();
});

describe("CartPage Component", () => {
    it("renders cart page title", () => {
        render(<CartPage />, { wrapper: MemoryRouter });
        expect(screen.getByText(/your shopping cart/i)).toBeInTheDocument();
    });

    it("adds product passed from location state to cart", () => {
        render(<CartPage />, { wrapper: MemoryRouter });
        expect(screen.getByText("Test Product")).toBeInTheDocument();
        expect(screen.getByText(/₹100/)).toBeInTheDocument();
    });

    it("updates quantity when user types", () => {
        render(<CartPage />, { wrapper: MemoryRouter });
        const qtyInput = screen.getByDisplayValue("1");
        fireEvent.change(qtyInput, { target: { value: "2" } });
        expect(qtyInput).toHaveValue(2);
    });

    it("removes item when remove button is clicked", () => {
        render(<CartPage />, { wrapper: MemoryRouter });
        const removeBtn = screen.getByText(/remove/i);
        fireEvent.click(removeBtn);
        expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });

    it("navigates to product page when Add More clicked", () => {
        render(<CartPage />, { wrapper: MemoryRouter });
        const addMoreBtn = screen.getByText(/add more products/i);
        fireEvent.click(addMoreBtn);
        expect(mockNavigate).toHaveBeenCalledWith("/productpage");
    });

    it("places order successfully (mocked API)", async () => {
        render(<CartPage />, { wrapper: MemoryRouter });

        const finalBtn = screen.getByText(/final order/i);
        fireEvent.click(finalBtn);

        await waitFor(
            () => {
                expect(global.fetch).toHaveBeenCalledTimes(1);
                expect(window.alert).toHaveBeenCalledWith(
                    expect.stringContaining("Order placed successfully")
                );
            },
            { timeout: 1000 }
        );
    });

    it("shows alert when cart is empty", async () => {
        // Re-render component with no product
        (jest.requireMock("react-router-dom") as any).useLocation = () => ({ state: {} });

        render(<CartPage />, { wrapper: MemoryRouter });
        const finalBtn = screen.getByText(/final order/i);
        fireEvent.click(finalBtn);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Your cart is empty!");
        });
    });

    it("handles failed API response gracefully", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: "Order failed" }),
        });

        render(<CartPage />, { wrapper: MemoryRouter });

        const finalBtn = screen.getByText(/final order/i);
        fireEvent.click(finalBtn);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(
                expect.stringContaining("Failed to place order")
            );
        });
    });
});
