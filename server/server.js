require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "*"
}));
app.use(express.json());

app.post("/send-order", async (req, res) => {
  const { customerEmail, cartItems } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const orderText = cartItems.map(item =>
    `${item.name} — ₹${item.price} × ${item.quantity}`
  ).join("\n");

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
    console.log("🛒 Order received!", cartItems, customerEmail);

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false, error: "Failed to send email." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
