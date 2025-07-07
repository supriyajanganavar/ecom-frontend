import { useEffect, useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  // Move fetchCart outside useEffect so it can be reused
  const fetchCart = async () => {
    const res = await api.get("/cart");
    setCart(res.data.cart);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    await api.put("/cart", { productId, quantity });
    fetchCart(); // Fetch updated cart
  };

  const removeItem = async (productId) => {
    await api.delete("/cart/product", { data: { productId } });
    fetchCart(); // Fetch updated cart
  };

  const clearCart = async () => {
    await api.delete("/cart");
    fetchCart(); // Fetch updated cart
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (!cart) return <div className="p-8">Loading cart...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.products.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/">Go shopping</Link>
        </p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.products.map((item) => (
              <li
                key={item._id}
                className="border p-4 rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{item.productId.title}</h3>
                  <p>Price: ₹{item.productId.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId._id, item.quantity - 1)
                    }
                    className="px-2 py-1 bg-gray-200"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId._id, item.quantity + 1)
                    }
                    className="px-2 py-1 bg-gray-200"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.productId._id)}
                    className="text-red-600 ml-4"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-semibold">Total: ₹{cart.totalPrice}</p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleCheckout}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={clearCart}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
