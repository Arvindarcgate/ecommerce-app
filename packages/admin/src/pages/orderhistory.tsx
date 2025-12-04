import React, { useEffect, useState } from 'react';
import styles from './orderhistory.module.css';
import { API_BASE_URL } from '../config/env';

interface OrderItem {
  product: string;
  quantity: number;
  item_total: string;
}

interface Order {
  id: number;
  email: string;
  total_amount: string;
  created_at: string;
  items: OrderItem[];
}

const ITEMS_PER_PAGE = 10;

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterEmail, setFilterEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const url = filterEmail
        ? `${API_BASE_URL}/api/orders/all?email=${filterEmail}`
        : `${API_BASE_URL}/api/orders/all`;

      const res = await fetch(url);
      const data = await res.json();

      const sortedData = data.sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setOrders(sortedData);
      setCurrentPage(0);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginatedOrders = orders.slice(
    currentPage * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>🧾 Order History</h2>

      <div className={styles.filterSection}>
        <input
          type="text"
          placeholder="Filter by Email"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
          className={styles.filterInput}
        />
        <button onClick={fetchOrders} className={styles.filterButton}>
          Search
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.orderTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User Email</th>
              <th>Products</th>
              <th>Total Amount</th>
              <th>Order Time</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.email}</td>
                  <td>
                    {order.items.map((item, i) => (
                      <div key={i} className={styles.productItem}>
                        🛍️ <strong>{item.product}</strong> × {item.quantity} = ₹
                        {item.item_total}
                      </div>
                    ))}
                  </td>
                  <td>₹{order.total_amount}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: 'center', padding: '15px' }}
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={styles.pageButton}
          >
            ◀ Prev
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className={styles.pageButton}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
