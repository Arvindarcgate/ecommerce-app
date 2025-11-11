import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GetReadyPage from "../frontend/pages/getReady";

// --- Mock useNavigate ---
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

// --- Global setup & teardown ---
beforeAll(() => {
    // Prevent jsdom from trying to "load" images and triggering fetch
    Object.defineProperty(global.Image.prototype, "src", {
        set() {
            /* no-op */
        },
    });

    jest.spyOn(window, "alert").mockImplementation(() => { });
    jest.spyOn(window, "confirm").mockImplementation(() => true);
});

afterAll(() => {
    jest.restoreAllMocks();
});

// Helper to set localStorage mock for each test (must be called BEFORE render)
const setMockLocalStorage = (data: any[]) => {
    Object.defineProperty(window, "localStorage", {
        configurable: true,
        value: {
            getItem: jest.fn((key: string) => {
                // If the component calls localStorage.getItem("productQueue")
                if (key === "productQueue") return JSON.stringify(data);
                return null;
            }),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn(),
        },
    });
};

describe("GetReadyPage Component", () => {
    let fetchMock: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        // Provide a fresh jest.fn() fetch for each test
        fetchMock = jest.fn();
        (global as any).fetch = fetchMock;
        // reset mockNavigate
        mockNavigate.mockReset();
    });

    test("renders empty queue message when no products", async () => {
        setMockLocalStorage([]); // no products
        render(
            <MemoryRouter>
                <GetReadyPage />
            </MemoryRouter>
        );

        // Component shows message after useEffect loads from localStorage
        expect(await screen.findByText(/No products in queue/i)).toBeInTheDocument();
    });

    test("renders products from localStorage", async () => {
        const queue = [
            {
                productName: "Shirt",
                price: 500,
                size: "M",
                imagePreview: "data:image/png;base64,abc",
            },
        ];
        setMockLocalStorage(queue);

        render(
            <MemoryRouter>
                <GetReadyPage />
            </MemoryRouter>
        );

        // Wait for the product to appear (useEffect -> setState is async)
        expect(await screen.findByText("Shirt")).toBeInTheDocument();
        expect(screen.getByText(/₹500/i)).toBeInTheDocument();
        expect(screen.getByText(/Size: M/)).toBeInTheDocument();
    });

    test("deletes a product from queue", async () => {
        const queue = [
            {
                productName: "Shoe",
                price: 1000,
                size: "L",
                imagePreview: "data:image/png;base64,abc",
            },
        ];
        setMockLocalStorage(queue);

        render(
            <MemoryRouter>
                <GetReadyPage />
            </MemoryRouter>
        );

        const deleteBtn = await screen.findByText("Delete");
        fireEvent.click(deleteBtn);

        // setItem should have been called to update localStorage
        expect(window.localStorage.setItem).toHaveBeenCalled();
    });

    test("launches a product successfully", async () => {
        const queue = [
            {
                productName: "Hat",
                price: 250,
                size: "S",
                imagePreview: "data:image/png;base64,xyz",
            },
        ];
        setMockLocalStorage(queue);
        (window as any).confirm = jest.fn(() => true);

        // 1st fetch -> image fetch that returns a Response-like object with blob()
        // 2nd fetch -> actual POST to backend
        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                blob: async () => new Blob(["dummy"], { type: "image/png" }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: "Success" }),
            });

        render(
            <MemoryRouter>
                <GetReadyPage />
            </MemoryRouter>
        );

        const launchBtn = await screen.findByText("Launch");
        fireEvent.click(launchBtn);

        await waitFor(() => {
            // Filter fetch mock calls to find the POST to /api/products/add
            const apiCalls = fetchMock.mock.calls.filter(
                ([url]: [unknown]) =>
                    typeof url === "string" && url.includes("/api/products/add")
            );

            expect(apiCalls.length).toBeGreaterThan(0);
            // first argument of the API call should be the URL
            expect(apiCalls[0][0]).toBe("http://localhost:8000/api/products/add");
            expect(apiCalls[0][1]).toEqual(expect.objectContaining({ method: "POST" }));

            expect(window.alert).toHaveBeenCalledWith(
                expect.stringMatching(/launched successfully/i)
            );
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    test("handles server/network error gracefully", async () => {
        const queue = [
            {
                productName: "Watch",
                price: 800,
                size: "M",
                imagePreview: "data:image/png;base64,xyz",
            },
        ];
        setMockLocalStorage(queue);
        (window as any).confirm = jest.fn(() => true);

        // first fetch for blob succeeds, second fetch rejects (simulated network error)
        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                blob: async () => new Blob(["dummy"], { type: "image/png" }),
            })
            .mockRejectedValueOnce(new Error("Network error"));

        render(
            <MemoryRouter>
                <GetReadyPage />
            </MemoryRouter>
        );

        const launchBtn = await screen.findByText("Launch");
        fireEvent.click(launchBtn);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(
                expect.stringMatching(/Server error/i)
            );
        });
    });
});
