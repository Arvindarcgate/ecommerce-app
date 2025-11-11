// src/__tests__/Productpage.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductPages from "../frontend/pages/productpages";
import { MemoryRouter } from "react-router-dom";

// 🧠 Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

// 🧰 Mock localStorage
beforeEach(() => {
    const localStorageMock = (function () {
        let store: Record<string, string> = {};
        return {
            getItem: (key: string) => store[key] || null,
            setItem: (key: string, value: string) => {
                store[key] = value;
            },
            clear: () => {
                store = {};
            },
            removeItem: (key: string) => {
                delete store[key];
            },
        };
    })();
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    jest.clearAllMocks();
});

describe("🧪 ProductPages Component", () => {
    test("renders form elements correctly", () => {
        render(
            <MemoryRouter>
                <ProductPages />
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText(/Enter Product Name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter Price/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter Size/i)).toBeInTheDocument();
        expect(screen.getByText(/Preview Product/i)).toBeInTheDocument();
    });

    test("handles image upload and shows preview", async () => {
        render(
            <MemoryRouter>
                <ProductPages />
            </MemoryRouter>
        );

        const fileInput = screen.getByTestId("file-input");
        const file = new File(["dummy content"], "example.png", { type: "image/png" });

        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => {
            const img = screen.getByTestId("image-preview");
            expect(img).toBeInTheDocument();
        });
    });

    // test("saves valid product data to localStorage and navigates to /getReady", async () => {
    //     render(
    //         <MemoryRouter>
    //             <ProductPages />
    //         </MemoryRouter>
    //     );

    //     // Fill inputs
    //     fireEvent.change(screen.getByPlaceholderText(/Enter Product Name/i), {
    //         target: { value: "T-Shirt" },
    //     });
    //     fireEvent.change(screen.getByPlaceholderText(/Enter Price/i), {
    //         target: { value: "499" },
    //     });
    //     fireEvent.change(screen.getByPlaceholderText(/Enter Size/i), {
    //         target: { value: "M" },
    //     });

    //     const file = new File(["dummy content"], "example.png", { type: "image/png" });
    //     fireEvent.change(screen.getByTestId("file-input"), { target: { files: [file] } });

    //     // Submit the form
    //     const submitButton = screen.getByText(/Preview Product/i);
    //     fireEvent.click(submitButton);

    //     // ✅ Wait for navigate to be called
    //     await waitFor(() => {
    //         expect(mockNavigate).toHaveBeenCalledTimes(1);
    //         expect(mockNavigate).toHaveBeenCalledWith("/getReady");
    //     });

    //     // ✅ Check localStorage contents
    //     const storedQueue = JSON.parse(localStorage.getItem("productQueue") || "[]");
    //     expect(storedQueue.length).toBe(1);
    //     expect(storedQueue[0].productName).toBe("T-Shirt");
    // });
});
