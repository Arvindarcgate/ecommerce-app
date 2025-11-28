import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminProductEdit from "../frontend/pages/adminProductedit";

// GLOBAL MOCKS
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

const mockConfirm = jest.fn();
global.confirm = mockConfirm;

const mockAlert = jest.fn();
global.alert = mockAlert;

const sampleProducts = [
    { id: 1, name: "Shirt", price: 500, size: "M", image: "/img1.png" },
];

describe("AdminProductEdit Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // First fetch (load products)
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => sampleProducts,
        });
    });

    test("loads and displays products (covers line 25)", async () => {
        render(<AdminProductEdit />);

        expect(await screen.findByText("Shirt")).toBeInTheDocument();
    });

    test("delete product success (covers handleDelete success)", async () => {
        render(<AdminProductEdit />);

        await screen.findByText("Shirt");

        mockConfirm.mockReturnValue(true);

        // DELETE success mock
        mockFetch.mockResolvedValueOnce({ ok: true });

        fireEvent.click(screen.getByText("🗑️ Delete"));

        await waitFor(() => {
            expect(mockAlert).toHaveBeenCalledWith("🗑️ Product deleted successfully!");
        });
    });

    test("delete product failure (covers lines 52-56)", async () => {
        render(<AdminProductEdit />);

        await screen.findByText("Shirt");

        mockConfirm.mockReturnValue(true);

        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: "Delete failed" }),
        });

        fireEvent.click(screen.getByText("🗑️ Delete"));

        await waitFor(() => {
            expect(mockAlert).toHaveBeenCalledWith("Error: Delete failed");
        });
    });

    test("open edit form + input updates + cancel (covers 141-171)", async () => {
        render(<AdminProductEdit />);

        await screen.findByText("Shirt");

        fireEvent.click(screen.getByText("✏️ Edit"));

        // Now form is visible
        const nameInput = screen.getByPlaceholderText("Product Name");
        const priceInput = screen.getByPlaceholderText("Price");
        const sizeInput = screen.getByPlaceholderText("Size (e.g. S, M, L)");

        fireEvent.change(nameInput, { target: { value: "Updated Shirt" } });
        fireEvent.change(priceInput, { target: { value: "999" } });
        fireEvent.change(sizeInput, { target: { value: "L" } });

        fireEvent.click(screen.getByText("Cancel"));

        await waitFor(() => {
            expect(screen.queryByText("Edit Product")).toBeNull();
        });
    });

    test("update product success (covers success path)", async () => {
        render(<AdminProductEdit />);

        await screen.findByText("Shirt");

        fireEvent.click(screen.getByText("✏️ Edit"));

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: "success" }),
        });

        fireEvent.click(screen.getByText(" Update"));

        await waitFor(() => {
            expect(mockAlert).toHaveBeenCalledWith(" Product updated successfully!");
        });
    });

    test("update product failure (covers lines 89-92)", async () => {
        render(<AdminProductEdit />);

        await screen.findByText("Shirt");

        fireEvent.click(screen.getByText("✏️ Edit"));

        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: "Update failed" }),
        });

        fireEvent.click(screen.getByText(" Update"));

        await waitFor(() => {
            expect(mockAlert).toHaveBeenCalledWith("Error: Update failed");
        });
    });
});
