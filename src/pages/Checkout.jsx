import { useEffect, useState } from "react";
import api from "../services/api";

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

  const handlePayment = async () => {
    setLoading(true);
    const res = await api.post("/orders/create-razorpay-order");
    const { razorpayOrderId, amount, currency } = res.data;

    const resScript = await loadRazorpayScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!resScript) return alert("Failed to load Razorpay SDK");

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount,
      currency,
      order_id: razorpayOrderId,
      handler: async (response) => {
        await api.post("/orders/verify-payment", response);
        alert("Payment successful!");
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <button
        onClick={handlePayment}
        className="bg-green-600 text-white px-6 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Checkout;
