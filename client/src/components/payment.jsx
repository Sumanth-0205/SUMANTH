import React,{useState} from "react";
import {useLocation,useNavigate } from "react-router-dom";
import axios from "axios";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  


  const { total, customerEmail, cartItems } = location.state || {};

  const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const [showAlert, setShowAlert] = useState(false);
  const [paymentId, setPaymentId] = useState(null);


  const proceedToNext = async () => {
    setShowAlert(false);
    try {
      await axios.post("https://sumanth-rta0.onrender.com/send-order", {
        customerEmail,
        cartItems
      });
    } catch (error) {
      console.error("Email failed:", error);
    }
    navigate("/thank-you");
  };



  const openRazorpay = async () => {
    try {
      const res = await axios.post("https://sumanth-rta0.onrender.com/create-order", {
        amount: total
      });

      const order = res.data;

      console.log(" Order received from backend:", order); // Add this log


      const options = {
        key: "rzp_test_8TdcNPQGJRhcCs",
        amount: order.amount,
        currency: "INR",
        name: "Food Ordering App",
        description: `Order for ₹${order.amount / 100}`,
       
        order_id: order.id,
     
       handler: function (response) {
          setPaymentId(response.razorpay_payment_id);
          setShowAlert(true);

          setTimeout(() => {
            proceedToNext();
          }, 5000);
        },

 
        prefill: {
          name: "Customer Name",
          email: customerEmail || "test@example.com",
          contact: "9000000000"
        },
        theme: {
          color: "#ff6b00"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(" Razorpay error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Complete Your Payment</h2>
      <p>Click below to pay ₹{total} using Razorpay (Test Mode)</p>
      <button
        onClick={openRazorpay}
        style={{
          padding: "12px 24px",
          backgroundColor: "#ff6b00",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Pay Now
      </button>

        {showAlert && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
             <div style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "8px",
            textAlign: "center",
            width: "300px"
          }}>
             <h2>✅ Payment Successful</h2>
            <p>Payment ID: {paymentId}</p>
            <p>Redirecting automatically in 5 seconds…</p>
            <button
              onClick={proceedToNext}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#ff6b00",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}



    </div>
  );
}

export default Payment;
