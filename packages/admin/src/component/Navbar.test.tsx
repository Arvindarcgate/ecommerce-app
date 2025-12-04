
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

describe("Navbar Component", () => {
    test("renders Navbar title", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByText("Admin Portal")).toBeInTheDocument();
    });

    test("renders all navigation links", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const links = [
            "Admin Login",
            "Admin Signup",
            "Add Product",
            "Get Ready",
            "Product edit",
            "Order History",
        ];

        links.forEach((text) => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });

    test("each link has correct path", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByText("Admin Login").getAttribute("href")).toBe(
            "/admin-login"
        );
        expect(screen.getByText("Admin Signup").getAttribute("href")).toBe(
            "/admin-signup"
        );
        expect(screen.getByText("Add Product").getAttribute("href")).toBe(
            "/add-product"
        );
        expect(screen.getByText("Get Ready").getAttribute("href")).toBe("/getready");
        expect(screen.getByText("Product edit").getAttribute("href")).toBe(
            "/product-edit"
        );
        expect(screen.getByText("Order History").getAttribute("href")).toBe(
            "/admin/orders"
        );
    });

    test("matches snapshot", () => {
        const { asFragment } = render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
