import React from "react";
import "./Card.css"; // external CSS file

type CardProps = {
  title: string;
  description: string;
  image?: string;
  children?: React.ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  children,
  className,
}) => {
  return (
    <div className={`card ${className || ""}`}>
      {image && <img src={image} alt={title} className="card-img" />}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        {children && <div className="card-extra">{children}</div>}
      </div>
    </div>
  );
};

export default Card;
