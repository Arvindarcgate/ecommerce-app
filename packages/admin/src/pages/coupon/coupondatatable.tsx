import styles from './coupondatatable.module.css';
import toast from 'react-hot-toast';

export type CouponTableItem = {
  id: number;
  code: string;
  discount_type: 'PERCENTAGE' | 'FLAT';
  discount_value: number;
  min_order_amount?: number;
  max_discount?: number;
  usage_limit_per_user?: number;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'INACTIVE';
};

type CouponDataTableProps = {
  coupons: CouponTableItem[];
  onEdit: (coupon: CouponTableItem) => void;
  onDelete: (id: number) => void;
};

export default function CouponDataTable({
  coupons,
  onEdit,
  onDelete,
}: CouponDataTableProps) {
  if (!coupons || coupons.length === 0) {
    return <p className={styles.empty}>No coupons created yet</p>;
  }

  const handleDelete = (id: number) => {
    onDelete(id);
    toast.success('Coupon deleted successfully');
  };

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount</th>
            <th>Min Order</th>
            <th>Usage / User</th>
            <th>Validity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon.id}>
              <td className={styles.code}>{coupon.code}</td>

              <td>
                {coupon.discount_type === 'PERCENTAGE'
                  ? `${coupon.discount_value}%`
                  : `₹${coupon.discount_value}`}
              </td>

              <td>
                {coupon.min_order_amount ? `₹${coupon.min_order_amount}` : '-'}
              </td>

              <td>{coupon.usage_limit_per_user ?? '-'}</td>

              <td>
                {formatDate(coupon.start_date)} – {formatDate(coupon.end_date)}
              </td>

              <td>
                <span
                  className={`${styles.status} ${
                    coupon.status === 'ACTIVE' ? styles.active : styles.inactive
                  }`}
                >
                  {coupon.status}
                </span>
              </td>

              <td className={styles.actions}>
                <button className={styles.edit} onClick={() => onEdit(coupon)}>
                  Edit
                </button>

                <button
                  className={styles.delete}
                  onClick={() => handleDelete(coupon.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Utils ---------- */
function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}
