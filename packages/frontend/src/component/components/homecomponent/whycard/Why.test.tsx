import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Why from "../Why";

describe("Why Component", () => {
  test("renders section title and subtitle", () => {
    render(<Why />);

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Why Choose Us"
    );

    expect(
      screen.getByText("Experience the difference with our premium service")
    ).toBeInTheDocument();
  });

  test("renders all feature cards", () => {
    render(<Why />);

    const features = ["Free Shipping", "Secure Payment", "Fast Delivery"];

    features.forEach((featureTitle) => {
      expect(screen.getByText(featureTitle)).toBeInTheDocument();
    });
  });

  test("renders descriptions for each feature", () => {
    render(<Why />);

    expect(
      screen.getByText(
        "Free delivery on orders over $50 with our express shipping network"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Your payment information is protected with bank-level security"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Get your orders in 2-3 business days anywhere in the country"
      )
    ).toBeInTheDocument();
  });
});
