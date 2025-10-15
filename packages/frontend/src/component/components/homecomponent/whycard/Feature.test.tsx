import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Feature from "./FeatureCard";
import { Truck } from "lucide-react";

describe("Feature Component", () => {
  test("renders icon, title, and description", () => {
    render(
      <Feature
        icon={<Truck data-testid="truck-icon" />} // Add data-testid for SVG icon
        title="Free Shipping"
        description="Fast delivery across the country"
      />
    );

    expect(screen.getByText("Free Shipping")).toBeInTheDocument();
    expect(
      screen.getByText("Fast delivery across the country")
    ).toBeInTheDocument();
    expect(screen.getByTestId("truck-icon")).toBeInTheDocument();
  });
});
