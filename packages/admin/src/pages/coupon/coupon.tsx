import { useEffect, useState } from 'react';
import { CouponForm, CouponFormValues } from '@ecommerce/coupon';
import CouponPreview from './couponpreview';
import CouponDataTable, { CouponTableItem } from './coupondatatable';
import styles from './coupon.module.css';
import { API_BASE_URL } from '../../config/env';

export default function CouponPage() {
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [coupon, setCoupon] = useState<CouponFormValues | null>(null);
  const [coupons, setCoupons] = useState<CouponTableItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/coupons`);
      const data = await res.json();
      setCoupons(data.data ?? []);
    } catch {
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = (values: CouponFormValues) => {
    setCoupon(values);
    setShowPreview(true);
    setShowForm(false);
  };

  const handleConfirm = async (finalCoupon: CouponFormValues) => {
    try {
      const payload = {
        ...finalCoupon,
        startDate: finalCoupon.startDate.slice(0, 10),
        endDate: finalCoupon.endDate.slice(0, 10),
        minOrderAmount: finalCoupon.minOrderAmount ?? 0,
        maxDiscount: finalCoupon.maxDiscount ?? 0,
        usageLimitPerUser: finalCoupon.usageLimitPerUser ?? 0,
      };

      const res = await fetch(`${API_BASE_URL}/api/admin/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      setCoupon(null);
      setShowPreview(false);
      fetchCoupons();
    } catch {}
  };

  const handleEdit = (c: CouponTableItem) => {
    setCoupon({
      code: c.code,
      discountType: c.discount_type,
      discountValue: c.discount_value,
      minOrderAmount: c.min_order_amount,
      maxDiscount: c.max_discount,
      usageLimitPerUser: c.usage_limit_per_user,
      startDate: c.start_date,
      endDate: c.end_date,
      status: c.status,
    });
    setShowForm(true);
    setShowPreview(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_BASE_URL}/api/coupons/${id}`, {
        method: 'DELETE',
      });
      fetchCoupons();
    } catch {}
  };

  return (
    <div className={styles.container}>
      <div className={styles.topActions}>
        {!showForm && !showPreview && (
          <button
            className={styles.createButton}
            onClick={() => setShowForm(true)}
          >
            + Create Coupon
          </button>
        )}
      </div>

      {showForm && (
        <CouponForm
          onSubmit={handleSubmit}
          initialValues={coupon ?? undefined}
        />
      )}

      {showPreview && coupon && (
        <CouponPreview
          coupon={coupon}
          onDelete={() => {
            setCoupon(null);
            setShowPreview(false);
          }}
          onConfirm={handleConfirm}
        />
      )}

      {loading && <p>Loading coupons...</p>}

      <CouponDataTable
        coupons={coupons}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
