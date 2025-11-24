/**
 * @file adminProductpage.test.ts
 * Full test coverage for addProduct & getProducts
 */

import { Request, Response } from "express";

/* ---------------------------
   MOCK Product.query()
---------------------------- */

// mockInsert → used for addProduct
const mockInsert = jest.fn();

// mockQuery → must return an object with insert()
// BUT for getProducts, it must return an array
const mockQuery = jest.fn();

// When Product.query() is called, return an object that contains insert()
mockQuery.mockImplementation(() => ({
    insert: mockInsert,
}));

jest.mock("../models/adminproduct", () => ({
    __esModule: true,
    Product: {
        query: mockQuery,
    },
}));

// After mocking → import controllers
import { addProduct, getProducts } from "../controllers/adminProductpage";

/* ---------------------------
   Mock Response Object
---------------------------- */
const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

/* ---------------------------
   TEST SUITE
---------------------------- */
describe("Admin Product Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /* ---------------------------
       1) ADD PRODUCT → 400
    ---------------------------- */
    test("should return 400 if required fields are missing", async () => {
        const req = {
            body: {
                name: "Shirt",
                price: 200,
                size: "M",
            },
            file: null,
        } as any;

        const res = mockResponse();

        await addProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "All fields are required",
        });
    });

    /* ---------------------------
       2) ADD PRODUCT → SUCCESS
    ---------------------------- */
    test("should add product successfully", async () => {
        const fakeProduct = {
            id: 1,
            name: "Shirt",
            price: 200,
            size: "M",
            image: "/uploads/test.jpg",
        };

        const req = {
            body: {
                name: "Shirt",
                price: 200,
                size: "M",
            },
            file: { filename: "test.jpg" },
        } as any;

        const res = mockResponse();

        // insert() returns product
        mockInsert.mockResolvedValueOnce(fakeProduct);

        await addProduct(req, res);

        expect(mockInsert).toHaveBeenCalledWith({
            name: "Shirt",
            price: 200,
            size: "M",
            image: "/uploads/test.jpg",
        });

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "✅ Product added successfully",
            product: fakeProduct,
        });
    });

    /* ---------------------------
       3) ADD PRODUCT → ERROR (500)
    ---------------------------- */
    test("should return 500 on addProduct failure", async () => {
        const req = {
            body: {
                name: "Shirt",
                price: 200,
                size: "M",
            },
            file: { filename: "test.jpg" },
        } as any;

        const res = mockResponse();

        mockInsert.mockRejectedValueOnce(new Error("DB error"));

        await addProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Server Error",
            error: "DB error",
        });
    });

    /* ---------------------------
       4) GET PRODUCTS → SUCCESS
    ---------------------------- */
    test("should return all products", async () => {
        const fakeProducts = [
            { id: 1, name: "Shirt", price: 200, size: "M" },
            { id: 2, name: "Pant", price: 400, size: "L" },
        ];

        const req = {} as Request;
        const res = mockResponse();

        // For getProducts → Product.query() returns array, not insert()
        mockQuery.mockResolvedValueOnce(fakeProducts);

        await getProducts(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeProducts);
    });

    /* ---------------------------
       5) GET PRODUCTS → ERROR
    ---------------------------- */
    test("should return 500 when getProducts fails", async () => {
        const req = {} as Request;
        const res = mockResponse();

        mockQuery.mockRejectedValueOnce(new Error("DB fail"));

        await getProducts(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Server Error",
            error: "DB fail",
        });
    });
});
