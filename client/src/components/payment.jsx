import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { total, customerEmail, cartItems } = location.state || {};

  const [showAlert, setShowAlert] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [loading, setLoading] = useState(false);
const [countdown, setCountdown] = useState(5);


  const proceedToNext = async () => {
    setShowAlert(false);
    try {
      await axios.post("https://sumanth-rta0.onrender.com/send-order", {
        customerEmail,
        cartItems,
      });
    } catch (error) {
      console.error("Email failed:", error);
    }
    navigate("/thank-you");
  };

   useEffect(() => {
    if (showAlert && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (showAlert && countdown === 0) {
      proceedToNext();
    }
  }, [showAlert, countdown]);

  const openRazorpay = async () => {
    try {
      setLoading(true);
      console.log("Creating order...");

      const res = await axios.post("https://sumanth-rta0.onrender.com/create-order", {
        amount: total,
      });

      console.log("Order response:", res.data);

      setLoading(false);

      if (!window.Razorpay) {
        alert("Razorpay SDK failed to load.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_8TdcNPQGJRhcCs",
        amount: res.data.amount,
        currency: "INR",
        name: "Food Ordering App",
        description: `Order for ₹${res.data.amount / 100}`,
        order_id: res.data.id,
        handler: function (response) {
          try {
            console.log("Payment success:", response);
            setPaymentId(response.razorpay_payment_id);
            setShowAlert(true);
            setTimeout(proceedToNext, 5000);
          } catch (err) {
            console.error("Handler error:", err);
            alert("Payment handler failed.");
          }
        },
        prefill: {
          name: "Customer",
          email: customerEmail || "test@example.com",
          contact: "9000000000",
        },
        theme: { color: "#ff6b00" },
      };

      console.log("Opening Razorpay with options:", options);
      new window.Razorpay(options).open();
    } catch (err) {
      setLoading(false);
      console.error("Razorpay error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8f1e8",
      }}
    >
      <div
        style={{
          textAlign: "center",
          background: "#fff",
          padding: "40px",
          borderRadius: "12px",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Complete Your Payment</h2>
        <p>Click below to pay ₹{total} using Razorpay</p>
        <button
          onClick={openRazorpay}
          disabled={loading}
          style={{
            padding: "12px 24px",
            fontSize: "1.2rem",
            background: "#ff6b00",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            marginTop: "16px",
          }}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        {showAlert && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: 30,
                borderRadius: 10,
                maxWidth: "320px",
                textAlign: "center",
              }}
            >
              <h3>Payment Successful</h3>
              <p>Payment ID: {paymentId}</p>
              <p>Redirecting in 5 seconds…</p>
              <button
                onClick={proceedToNext}
                style={{
                  marginTop: 10,
                  padding: "10px 20px",
                  backgroundColor: "#ff6b00",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;
