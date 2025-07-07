import { useEffect, useState } from "react";
import api from "../services/api";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(null);
  const navigate = useNavigate(); // (optional, for navigation after payment)

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true); // Show loading while fetching cart
      const res = await api.get("/cart");
      setCart(res.data.cart);
      setLoading(false);
    };
    fetchCart();
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    const res = await api.post("/orders/create-razorpay-order");
    const { razorpayOrderId, amount, currency } = res.data;

    const resScript = await loadRazorpayScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!resScript) {
      setLoading(false);
      return alert("Failed to load Razorpay SDK");
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount,
      currency,
      order_id: razorpayOrderId,
      handler: async (response) => {
        await api.post("/orders/verify-payment", response);
        alert("Payment successful!");
        navigate("/"); // (optional, navigate to home after payment)
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  if (loading || !cart) return <Loading />; // <-- Use Loading component

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {cart.products.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {cart.products.map((item) => (
            <div key={item.productId._id} className="border p-4 rounded">
              <h3 className="font-semibold">{item.productId.title}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ₹{item.productId.price}</p>
              <p className="font-semibold">
                Subtotal: ₹{item.productId.price * item.quantity}
              </p>
            </div>
          ))}
          <p className="font-bold text-lg">Total: ₹{cart.totalPrice}</p>
          <button
            onClick={handlePayment}
            className="bg-green-600 text-white px-6 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
