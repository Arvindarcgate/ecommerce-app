

import { Request, Response } from "express";

const mockInsert = jest.fn();

const mockQuery = jest.fn();

mockQuery.mockImplementation(() => ({
    insert: mockInsert,
}));

jest.mock("../models/adminproduct", () => ({
    __esModule: true,
    Product: {
        query: mockQuery,
    },
}));

import { addProduct, getProducts } from "../controllers/adminProductpage";


const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};


describe("Admin Product Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

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
            message: " Product added successfully",
            product: fakeProduct,
        });
    });


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


    test("should return all products", async () => {
        const fakeProducts = [
            { id: 1, name: "Shirt", price: 200, size: "M" },
            { id: 2, name: "Pant", price: 400, size: "L" },
        ];

        const req = {} as Request;
        const res = mockResponse();


        mockQuery.mockResolvedValueOnce(fakeProducts);

        await getProducts(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeProducts);
    });

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
