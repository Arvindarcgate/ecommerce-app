// src/component/Footer.test.tsx
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "./Footer";

describe("Footer Component", () => {
  beforeEach(() => {
    render(<Footer />);
  });

  test("renders brand title and description", () => {
    expect(screen.getByText("E-commerce")).toBeInTheDocument();
    expect(
      screen.getByText(/Your trusted partner for premium products/i)
    ).toBeInTheDocument();
  });

  test("renders social media icons", () => {
    expect(screen.getByTestId("icon-facebook")).toBeInTheDocument();
    expect(screen.getByTestId("icon-twitter")).toBeInTheDocument();
    expect(screen.getByTestId("icon-instagram")).toBeInTheDocument();
    expect(screen.getByTestId("icon-youtube")).toBeInTheDocument();
  });

  test("renders quick links", () => {
    ["Home", "Product", "Contact", "Cart"].forEach((link) => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  test("renders customer service links", () => {
    const customerServiceSection =
      screen.getByText("Customer Services").parentElement!;
    const scoped = within(customerServiceSection);

    [
      "F&Q",
      "Shipping Info",
      "Returns",
      "Size Guide",
      "Privacy Policy",
      "Terms of Service",
    ].forEach((item) => {
      expect(scoped.getByText(item)).toBeInTheDocument();
    });
  });

  test("renders contact details", () => {
    const contactSection = screen.getByText("Contact Us").parentElement!;
    const scoped = within(contactSection);

    expect(scoped.getByText(/Location: 123 Commerce St/i)).toBeInTheDocument();
    expect(scoped.getByText(/\+1 \(555\) 123-4567/)).toBeInTheDocument();
    expect(scoped.getByText("support@ecommerce.com")).toBeInTheDocument();
  });

  test("renders bottom copyright and terms", () => {
    const bottomSection = screen.getByText(
      "© 2024 ECommerce. All rights reserved."
    ).parentElement!;
    const scoped = within(bottomSection);

    expect(
      scoped.getByText("© 2024 ECommerce. All rights reserved.")
    ).toBeInTheDocument();

    ["Privacy Policy", "Terms of Service", "Cookie Policy"].forEach((item) => {
      expect(scoped.getByText(item)).toBeInTheDocument();
    });
  });
});
