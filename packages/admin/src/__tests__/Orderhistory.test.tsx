
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import OrderHistory from "../frontend/pages/orderhistory";

// Mock the global fetch API
global.fetch = jest.fn();

describe("OrderHistory Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders without crashing and shows 'No orders found' initially", async () => {
        // @ts-ignore
        fetch.mockResolvedValueOnce({
            json: async () => [],
        });

        render(<OrderHistory />);

        expect(screen.getByText(/Order History/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/No orders found/i)).toBeInTheDocument();
        });
    });

    test("fetches and displays orders", async () => {
        const mockOrders = [
            {
                id: 1,
                email: "test@example.com",
                total_amount: "500",
                created_at: "2025-11-10T10:00:00Z",
                items: [
                    { product: "Shirt", quantity: 2, item_total: "200" },
                    { product: "Jeans", quantity: 1, item_total: "300" },
                ],
            },
        ];

        // @ts-ignore
        fetch.mockResolvedValueOnce({
            json: async () => mockOrders,
        });

        render(<OrderHistory />);

        // Wait for the orders to render
        await waitFor(() => {
            expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
        });

        expect(screen.getByText(/Shirt/i)).toBeInTheDocument();
        expect(screen.getByText(/Jeans/i)).toBeInTheDocument();
        expect(screen.getByText(/₹500/)).toBeInTheDocument();
    });

    test("filters orders by email when typing and clicking search", async () => {
        const mockOrders = [
            {
                id: 2,
                email: "filter@example.com",
                total_amount: "400",
                created_at: "2025-11-10T09:00:00Z",
                items: [{ product: "Shoes", quantity: 1, item_total: "400" }],
            },
        ];

        // @ts-ignore
        fetch.mockResolvedValue({
            json: async () => mockOrders,
        });

        render(<OrderHistory />);

        const input = screen.getByPlaceholderText(/Filter by Email/i);
        fireEvent.change(input, { target: { value: "filter@example.com" } });

        const searchButton = screen.getByText(/Search/i);
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(screen.getByText(/filter@example.com/i)).toBeInTheDocument();
        });

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("email=filter@example.com")
        );
    });

    test("handles fetch errors gracefully", async () => {
        // @ts-ignore
        fetch.mockRejectedValueOnce(new Error("Network error"));

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });

        render(<OrderHistory />);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                "Error fetching orders:",
                expect.any(Error)
            );
        });

        consoleSpy.mockRestore();
    });
});
