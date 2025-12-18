import { useState, useEffect } from 'react';
import { CouponFormValues } from '@ecommerce/coupon';
import styles from './couponpreview.module.css';
import { API_BASE_URL } from '../../config/env';
import toast from 'react-hot-toast';

interface Props {
  coupon: CouponFormValues;
  onEdit: () => void;
  onDelete: () => void;
  onConfirm: (coupon: CouponFormValues) => void;
}


const toInputDate = (iso?: string) => {
  if (!iso) return '';
  return iso.split('T')[0]; 
};

export default function CouponPreview({
  coupon: initialCoupon,
  onEdit,
  onDelete,
  onConfirm,
}: Props) {
  const [coupon, setCoupon] = useState<CouponFormValues>({
    ...initialCoupon,
    startDate: toInputDate(initialCoupon.startDate),
    endDate: toInputDate(initialCoupon.endDate),
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setCoupon({
      ...initialCoupon,
      startDate: toInputDate(initialCoupon.startDate),
      endDate: toInputDate(initialCoupon.endDate),
    });
  }, [initialCoupon]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setCoupon((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleConfirmAndSave = async () => {
    try {
      const payload: CouponFormValues = {
        ...coupon,
        discountValue: Number(coupon.discountValue),
        minOrderAmount: Number(coupon.minOrderAmount),
        maxDiscount: Number(coupon.maxDiscount),
        usageLimitPerUser: Number(coupon.usageLimitPerUser),
        startDate: coupon.startDate,
        endDate: coupon.endDate, 
      };

      const res = await fetch(`${API_BASE_URL}/api/admin/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP error! status: ${res.status}, message: ${text}`);
      }

      const data = await res.json();
      toast.success('Coupon saved successfully');
      onConfirm(payload);
      setIsEditing(false);
    } catch (error) {
      console.error('Save Coupon Error:', error);
      toast.error('Failed to save coupon');
    }
  };

  const renderRow = (
    label: string,
    name: keyof CouponFormValues,
    type: 'text' | 'number' | 'date' | 'select' = 'text'
  ) => (
    <div className={styles.row} key={name}>
      <span>{label}</span>
      {isEditing ? (
        type === 'select' ? (
          <select name={name} value={coupon[name]} onChange={handleChange}>
            {name === 'discountType' && (
              <>
                <option value="PERCENTAGE">Percentage</option>
                <option value="FLAT">Flat</option>
              </>
            )}
            {name === 'status' && (
              <>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </>
            )}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={coupon[name] as any}
            onChange={handleChange}
          />
        )
      ) : (
        <strong>{type === 'date' ? coupon[name] : coupon[name]}</strong>
      )}
    </div>
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Coupon Preview</h2>

        <div className={styles.card}>
          {renderRow('Coupon Code', 'code')}
          {renderRow('Discount Type', 'discountType', 'select')}
          {renderRow('Discount Value', 'discountValue', 'number')}
          {renderRow('Min Order', 'minOrderAmount', 'number')}
          {renderRow('Max Discount', 'maxDiscount', 'number')}
          {renderRow('Usage Limit', 'usageLimitPerUser', 'number')}
          {renderRow('Start Date', 'startDate', 'date')}
          {renderRow('End Date', 'endDate', 'date')}
          {renderRow('Status', 'status', 'select')}
        </div>

        <div className={styles.actions}>
          {!isEditing ? (
            <button className={styles.edit} onClick={() => setIsEditing(true)}>
              Edit
            </button>
          ) : (
            <button className={styles.confirm} onClick={handleConfirmAndSave}>
              Save & Confirm
            </button>
          )}
          <button className={styles.delete} onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
