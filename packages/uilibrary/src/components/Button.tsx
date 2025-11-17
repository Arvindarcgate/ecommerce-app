import React from "react";

export type Variant = "primary" | "secondary" | "ghost";
export type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    fullWidth?: boolean;
    icon?: React.ReactNode;
}


export const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    size = "md",
    fullWidth = false,
    icon,
    children,
    className = "",
    ...rest
}) => {
    const variantClasses: Record<Variant, string> = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300",
        ghost: "bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-100",
    };

    const sizeClasses: Record<Size, string> = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-5 py-3 text-lg",
    };

    const base =
        "inline-flex items-center justify-center rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    const classes = [
        base,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "inline-block",
        className,
    ].join(" ");

    return (
        <button
            type={rest.type ?? "button"}
            className={classes}
            {...rest}
        >
            {icon && <span className="mr-2 flex items-center">{icon}</span>}
            <span>{children}</span>
        </button>
    );
};


