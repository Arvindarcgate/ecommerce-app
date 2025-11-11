import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminProductEdit from "../frontend/pages/adminProductedit";

global.fetch = jest.fn() as jest.Mock;

const mockProducts = [
    { id: 1, name: "T-Shirt", price: 500, size: "M", image: "/uploads/tshirt.png" },
    { id: 2, name: "Jeans", price: 1200, size: "L", image: "/uploads/jeans.png" },
];

describe("🧪 AdminProductEdit Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders products after fetching", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockProducts,
        });

        render(<AdminProductEdit />);

        expect(screen.getByText(/manage products/i)).toBeInTheDocument();

        // Wait until the products appear
        await waitFor(() => {
            expect(screen.getByText("T-Shirt")).toBeInTheDocument();
            expect(screen.getByText("Jeans")).toBeInTheDocument();
        });
    });

    test("clicking edit opens edit form", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockProducts,
        });

        render(<AdminProductEdit />);

        await waitFor(() => screen.getByText("T-Shirt"));

        userEvent.click(screen.getAllByText(/✏️ Edit/i)[0]);

        await waitFor(() => {
            expect(screen.getByText(/edit product/i)).toBeInTheDocument();
            expect(screen.getByDisplayValue("T-Shirt")).toBeInTheDocument();
        });
    });

    test("editing and submitting form updates product", async () => {
        (fetch as jest.Mock)
            // initial fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockProducts,
            })
            // update call
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: "Updated successfully" }),
            })
            // refetch after update
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockProducts,
            });

        render(<AdminProductEdit />);

        await waitFor(() => screen.getByText("T-Shirt"));

        userEvent.click(screen.getAllByText(/✏️ Edit/i)[0]);

        await waitFor(() => screen.getByPlaceholderText(/product name/i));

        const nameInput = screen.getByPlaceholderText(/product name/i);
        fireEvent.change(nameInput, { target: { value: "Updated T-Shirt" } });

        userEvent.click(screen.getByText(/update/i));

        await waitFor(() =>
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining("/update/1"),
                expect.objectContaining({ method: "PUT" })
            )
        );
    });

    test("deleting product calls DELETE API", async () => {
        window.confirm = jest.fn(() => true);

        (fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockProducts,
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: "Deleted" }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [],
            });

        render(<AdminProductEdit />);

        await waitFor(() => screen.getByText("Jeans"));

        userEvent.click(screen.getAllByText(/🗑️ Delete/i)[0]);

        await waitFor(() =>
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining("/delete/1"),
                expect.objectContaining({ method: "DELETE" })
            )
        );
    });

    test("cancel button closes edit form", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockProducts,
        });

        render(<AdminProductEdit />);
        await waitFor(() => screen.getByText("T-Shirt"));

        userEvent.click(screen.getAllByText(/✏️ Edit/i)[0]);

        await waitFor(() => screen.getByText(/cancel/i));

        userEvent.click(screen.getByText(/cancel/i));

        await waitFor(() => {
            expect(screen.queryByText(/edit product/i)).not.toBeInTheDocument();
        });
    });

    test("handles fetch error gracefully", async () => {
        (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

        render(<AdminProductEdit />);
        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
        });
    });
});
