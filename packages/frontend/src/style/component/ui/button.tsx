
import React from "react";
import "../../../style/pages/button.css"; // external CSS file

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

const Button: React.FC<ButtonProps> = ({ variant = "primary", className, ...props }) => {
  return <button className={`btn btn-${variant} ${className || ""}`} {...props} />;
};

export default Button;
