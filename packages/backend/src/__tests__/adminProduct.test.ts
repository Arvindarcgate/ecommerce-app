
import { Request, Response } from "express";


const mockInsert = jest.fn();

const mockQuery = jest.fn().mockImplementation(() => ({
    insert: mockInsert,
}));


jest.mock("../models/adminproduct", () => ({
    __esModule: true,
    Product: { query: mockQuery },
}));


import { addProduct, getProducts } from "../controllers/adminProductpage";


const createRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};


const validBody = {
    name: "Shirt",
    price: 200,
    size: "M",
};

const validFile = { filename: "test.jpg" };

const fakeProduct = {
    id: 1,
    ...validBody,
    image: "/uploads/test.jpg",
};


describe("Admin Product Controller (DRY optimized)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    test("should return 400 if required fields are missing", async () => {
        const req = { body: { ...validBody }, file: null } as any;
        const res = createRes();

        await addProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "All fields are required",
        });
    });


    test("should add product successfully", async () => {
        const req = { body: validBody, file: validFile } as any;
        const res = createRes();

        mockInsert.mockResolvedValueOnce(fakeProduct);

        await addProduct(req, res);

        expect(mockInsert).toHaveBeenCalledWith({
            ...validBody,
            image: "/uploads/test.jpg",
        });

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "✅ Product added successfully",
            product: fakeProduct,
        });
    });


    test("should return 500 on addProduct failure", async () => {
        const req = { body: validBody, file: validFile } as any;
        const res = createRes();

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
        const res = createRes();


        mockQuery.mockResolvedValueOnce(fakeProducts);

        await getProducts(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeProducts);
    });


    test("should return 500 when getProducts fails", async () => {
        const req = {} as Request;
        const res = createRes();

        mockQuery.mockRejectedValueOnce(new Error("DB fail"));

        await getProducts(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Server Error",
            error: "DB fail",
        });
    });
});
