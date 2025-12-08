import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminProductEdit from "../pages/adminProductedit";
import { API_BASE_URL } from "../config/env";



jest.mock('../config/env', () => ({
  API_BASE_URL: 'http://localhost:8000',
}));

jest.mock('../pages/conformationModal', () => (props: any) => (
  props.open ? (
    <div data-testid="modal">
      <button onClick={props.onConfirm} data-testid="confirm-delete">Confirm</button>
      <button onClick={props.onCancel} data-testid="cancel-delete">Cancel</button>
    </div>
  ) : null
));


jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn()
}));

global.fetch = jest.fn();

const mockProducts = [
  {
    id: 1,
    name: "Test Product",
    price: 999,
    size: "M",
    image: "/img/test.png"
  }
];

describe("AdminProductEdit Component", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockProducts
    });
  });

  test("renders products after fetch", async () => {
    render(<AdminProductEdit />);

    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/api/products/all`);

    const product = await screen.findByText("Test Product");
    expect(product).toBeInTheDocument();
  });

  test("clicking Edit opens edit form", async () => {
    render(<AdminProductEdit />);

    const editButton = await screen.findByText("Edit");
    fireEvent.click(editButton);

    expect(screen.getByPlaceholderText("Product Name")).toBeInTheDocument();
  });

  test("updating product triggers API call", async () => {
    render(<AdminProductEdit />);

    fireEvent.click(await screen.findByText("Edit"));

    const updateBtn = screen.getByText("Update");

    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    fireEvent.click(updateBtn);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/products/update/1`,
        expect.any(Object)
      );
    });
  });

  test("click Delete opens modal", async () => {
    render(<AdminProductEdit />);

    const deleteBtn = await screen.findByText("Delete");
    fireEvent.click(deleteBtn);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  test("cancel delete closes modal", async () => {
    render(<AdminProductEdit />);

    fireEvent.click(await screen.findByText("Delete"));
    fireEvent.click(screen.getByTestId("cancel-delete"));

    await waitFor(() => {
      expect(screen.queryByTestId("modal")).toBeNull();
    });
  });

  test("confirm delete removes product", async () => {
    render(<AdminProductEdit />);

    fireEvent.click(await screen.findByText("Delete"));

    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    fireEvent.click(screen.getByTestId("confirm-delete"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/products/delete/1`,
        { method: "DELETE" }
      );
    });
  });
});
