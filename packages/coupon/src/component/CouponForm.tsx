import React, { useState } from 'react';
import styles from './couponform.module.css';

export type DiscountType = 'PERCENTAGE' | 'FLAT';

export interface CouponFormValues {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimitPerUser: number;
  status: 'ACTIVE' | 'INACTIVE';
}

interface CouponFormProps {
  onSubmit: (values: CouponFormValues) => void;
  initialValues?: Partial<CouponFormValues>;
}

export const CouponForm: React.FC<CouponFormProps> = ({
  onSubmit,
  initialValues = {},
}) => {
  const [form, setForm] = useState<CouponFormValues>({
    code: initialValues.code || '',
    discountType: initialValues.discountType || 'PERCENTAGE',
    discountValue: initialValues.discountValue || 0,
    minOrderAmount: initialValues.minOrderAmount || 0,
    maxDiscount: initialValues.maxDiscount || 0,
    startDate: initialValues.startDate || '',
    endDate: initialValues.endDate || '',
    usageLimitPerUser: initialValues.usageLimitPerUser || 1,
    status: initialValues.status || 'ACTIVE',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: e.target.type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2 className={styles.heading}>Create Coupon</h2>

      <div className={styles.field}>
        <label className={styles.label}>Coupon Code</label>
        <input
          className={styles.input}
          type="text"
          name="code"
          value={form.code}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Discount Type</label>
        <select
          className={styles.select}
          name="discountType"
          value={form.discountType}
          onChange={handleChange}
        >
          <option value="PERCENTAGE">Percentage (%)</option>
          <option value="FLAT">Flat Amount</option>
        </select>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Discount Value</label>
          <input
            className={styles.input}
            type="number"
            name="discountValue"
            value={form.discountValue}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Minimum Order</label>
          <input
            className={styles.input}
            type="number"
            name="minOrderAmount"
            value={form.minOrderAmount}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Max Discount</label>
          <input
            className={styles.input}
            type="number"
            name="maxDiscount"
            value={form.maxDiscount}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Usage / User</label>
          <input
            className={styles.input}
            type="number"
            name="usageLimitPerUser"
            value={form.usageLimitPerUser}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Start Date</label>
          <input
            className={styles.input}
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>End Date</label>
          <input
            className={styles.input}
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Status</label>
        <select
          className={styles.select}
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <button type="submit" className={styles.button}>
        Save Coupon
      </button>
    </form>
  );
};

export default CouponForm;
