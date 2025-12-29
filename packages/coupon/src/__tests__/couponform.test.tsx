import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CouponForm, { CouponFormValues } from "../component/CouponForm";

describe("CouponForm", () => {
  test("renders all required fields", () => {
    render(<CouponForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/coupon code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/discount type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/discount value/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/minimum order/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/max discount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/usage \/ user/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /save coupon/i })
    ).toBeInTheDocument();
  });

  test("submits correct data", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<CouponForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/coupon code/i), "SAVE10");
    await user.clear(screen.getByLabelText(/discount value/i));
    await user.type(screen.getByLabelText(/discount value/i), "10");
    await user.type(screen.getByLabelText(/start date/i), "2024-01-01");
    await user.type(screen.getByLabelText(/end date/i), "2024-12-31");

    await user.click(
      screen.getByRole("button", { name: /save coupon/i })
    );

    const expected: CouponFormValues = {
      code: "SAVE10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderAmount: 0,
      maxDiscount: 0,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      usageLimitPerUser: 1,
      status: "ACTIVE",
    };

    expect(onSubmit).toHaveBeenCalledWith(expected);
  });

  test("prefills initial values", () => {
    render(
      <CouponForm
        onSubmit={jest.fn()}
        initialValues={{
          code: "FLAT50",
          discountType: "FLAT",
          discountValue: 50,
          status: "INACTIVE",
        }}
      />
    );

    expect(screen.getByLabelText(/coupon code/i)).toHaveValue("FLAT50");
    expect(screen.getByLabelText(/discount value/i)).toHaveValue(50);
    expect(screen.getByLabelText(/discount type/i)).toHaveValue("FLAT");
    expect(screen.getByLabelText(/status/i)).toHaveValue("INACTIVE");
  });
});
