
import React from "react";
import styles from "./modal.module.css";

interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<Props> = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancel}>Cancel</button>
          <button onClick={onConfirm} className={styles.confirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
