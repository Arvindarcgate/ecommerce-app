import React from "react";

export interface CartItem {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface CartProps {
    items: CartItem[];
    onQuantityChange?: (id: string | number, newQty: number) => void;
    onRemove?: (id: string | number) => void;
    onCheckout?: () => void;
}

export const Cart: React.FC<CartProps> = ({
    items,
    onQuantityChange,
    onRemove,
    onCheckout,
}) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="p-4 border rounded-2xl shadow-md bg-white max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Cart</h2>

            {items.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Your cart is empty.</p>
            ) : (
                <>
                    <ul className="divide-y divide-gray-200">
                        {items.map((item) => (
                            <li key={item.id} className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3">
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-600">
                                            ₹{item.price.toFixed(2)} × {item.quantity}
                                        </p>
                                        <div className="flex items-center mt-1 gap-2">
                                            <button
                                                onClick={() =>
                                                    onQuantityChange?.(item.id, item.quantity - 1)
                                                }
                                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                                disabled={item.quantity <= 1}
                                            >
                                                −
                                            </button>
                                            <span className="text-gray-700">{item.quantity}</span>
                                            <button
                                                onClick={() =>
                                                    onQuantityChange?.(item.id, item.quantity + 1)
                                                }
                                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold text-gray-700">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => onRemove?.(item.id)}
                                        className="text-red-500 text-sm hover:underline mt-1"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="border-t mt-4 pt-4 flex justify-between items-center">
                        <p className="text-lg font-semibold text-gray-800">
                            Total: ₹{total.toFixed(2)}
                        </p>
                        <button
                            onClick={onCheckout}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
