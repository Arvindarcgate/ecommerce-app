import React from "react";
import styles from "./Feature.module.css";

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconClass?: string;
};

const Feature: React.FC<FeatureProps> = ({
  icon,
  title,
  description,
  iconClass,
}) => {
  return (
    <div className={styles.feature}>
      <div className={`${styles.icon} ${iconClass ? styles[iconClass] : ""}`}>
        {icon}
      </div>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
};

export default Feature;
