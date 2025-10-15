import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FeaturedProducts from "./FeaturedProduct";

describe("FeaturedProducts Component", () => {
  beforeEach(() => {
    render(<FeaturedProducts />);
  });

  test("renders title and description", () => {
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Featured Products"
    );

    expect(
      screen.getByText(/hand-picked selection of premium products/i)
    ).toBeInTheDocument();
  });

  test("renders all product cards", () => {
    const productCards = screen.getAllByRole("heading", { level: 4 }); // h4 used as product titles
    expect(productCards.length).toBe(4); // There should be 4 products
  });

  test("renders product names", () => {
    expect(screen.getByText("Premium Wireless Headphones")).toBeInTheDocument();
    expect(screen.getByText("Smart Fitness Watch")).toBeInTheDocument();
    expect(screen.getByText("Professional Camera Lens")).toBeInTheDocument();
    expect(screen.getByText("Ergonomic Office Chair")).toBeInTheDocument();
  });

  test("renders badges if available", () => {
    expect(screen.getByText("Best Seller")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Pro Choice")).toBeInTheDocument();
    expect(screen.getByText("Sale")).toBeInTheDocument();
  });

  test("renders current price and original price where applicable", () => {
    expect(screen.getByText("$299.99")).toBeInTheDocument();
    expect(screen.getByText("$399.99")).toBeInTheDocument(); // Original price

    expect(screen.getByText("$199.99")).toBeInTheDocument();

    expect(screen.getByText("$849.99")).toBeInTheDocument();

    expect(screen.getByText("$449.99")).toBeInTheDocument();
    expect(screen.getByText("$599.99")).toBeInTheDocument();
  });

  test("renders ratings and reviews", () => {
    expect(screen.getByText(/⭐ 4.8 \(124 reviews\)/)).toBeInTheDocument();
    expect(screen.getByText(/⭐ 4.6 \(89 reviews\)/)).toBeInTheDocument();
    expect(screen.getByText(/⭐ 4.9 \(67 reviews\)/)).toBeInTheDocument();
    expect(screen.getByText(/⭐ 4.7 \(156 reviews\)/)).toBeInTheDocument();
  });

  test("renders View Details button for each product", () => {
    const viewDetailButtons = screen.getAllByRole("button", {
      name: /View Details/i,
    });
    expect(viewDetailButtons.length).toBe(4);
  });

  test("renders View All Products button at bottom", () => {
    expect(
      screen.getByRole("button", { name: /View All Products/i })
    ).toBeInTheDocument();
  });
});
