import { useEffect, useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const res = await api.get("/cart");
      setCart(res.data.cart);
    };
    fetchCart();
  }, []);

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
          <ul>
            {cart.products.map((item) => (
              <li key={item.productId._id} className="mb-2">
                {item.productId.title} x {item.quantity}
              </li>
            ))}
          </ul>
          <p className="mt-4 font-semibold">Total: ₹{cart.totalPrice}</p>
          <button
            onClick={handleCheckout}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
