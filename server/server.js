require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

// 🧠 Razorpay instance (secure with secret key)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});

// ✅ Create Razorpay Order
app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // Razorpay uses paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("❌ Razorpay order error:", error);
    res.status(500).json({ error: "Failed to create Razorpay order." });
  }
});

// ✅ Email Confirmation
app.post("/send-order", async (req, res) => {
  const { customerEmail, cartItems } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: customerEmail,
    subject: "Your Order Confirmation",
    html: `
    <div style="font-family: 'Segoe UI', sans-serif; background: #fff8f2; padding: 20px; border-radius: 10px; border: 1px solid #ffb27e;">
      <h2 style="color: #e65c00;"> Thank you for your order!</h2>
      <p style="color: #444;">Hi there,</p>
      <p style="color: #444;">We're excited to confirm your order from <strong>Sumanth Foods</strong>. Here are your delicious details:</p>
      <ul style="color: #444;">
        ${cartItems.map(item => {
          const price = parseInt(item.price.replace("₹", ""));
          return `<li>${item.name} — ₹${price} × ${item.quantity} = ₹${price * item.quantity}</li>`;
        }).join("")}
      </ul>
      <p style="color: #444;"><strong>Total:</strong> ₹${cartItems.reduce((t, i) => t + parseInt(i.price.replace("₹", "")) * i.quantity, 0)}</p>
      <hr style="margin: 20px 0;">
      <p style="font-size: 0.9em; color: #888;">You’re receiving this because you placed an order on Sumanth Foods.</p>
    </div>
  `
  };

  try {
    console.log("🛒 Sending email to:", customerEmail);
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false, error: "Failed to send email." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
