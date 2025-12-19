import { CouponForm, CouponFormValues } from "@ecommerce/coupon";

export default function CouponPage() {
  const handleSubmit = (values: CouponFormValues) => {
    console.log("Coupon submitted from admin:", values);

  };

  return (
    <div style={{ padding: 24 }}>
      <CouponForm onSubmit={handleSubmit} />
    </div>
  );
}
