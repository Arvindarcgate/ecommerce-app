import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductPages from "../frontend/pages/productpages";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

beforeAll(() => {
    jest.spyOn(window, "alert").mockImplementation(() => { });
});

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
});

const renderPage = () =>
    render(
        <BrowserRouter>
            <ProductPages />
        </BrowserRouter>
    );

const fillForm = () => {
    fireEvent.change(screen.getByLabelText("Product Name"), {
        target: { value: "Shirt" },
    });
    fireEvent.change(screen.getByLabelText("Product Price"), {
        target: { value: "200" },
    });
    fireEvent.change(screen.getByLabelText("Product Size"), {
        target: { value: "L" },
    });

    const file = new File(["img"], "photo.png", { type: "image/png" });

    fireEvent.change(screen.getByTestId("file-input"), {
        target: { files: [file] },
    });
};

describe("ProductPages", () => {
    test("shows alert when fields are empty", () => {
        renderPage();

        fireEvent.submit(
            screen.getByTestId("product-page").querySelector("form")!
        );

        expect(window.alert).toHaveBeenCalledWith(
            "Please fill all fields before submitting."
        );
    });

    test("saves to localStorage and navigates on valid submit", () => {
        renderPage();
        fillForm();

        fireEvent.submit(
            screen.getByTestId("product-page").querySelector("form")!
        );

        expect(localStorage.getItem("productQueue")).not.toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith("/getReady");
    });

    test("catch block runs when localStorage.setItem throws", () => {
        renderPage();
        fillForm();

        jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw new Error("Storage Error");
        });

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });

        fireEvent.submit(
            screen.getByTestId("product-page").querySelector("form")!
        );

        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
