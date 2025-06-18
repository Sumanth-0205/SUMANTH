require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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
    text: `Thanks for ordering!\n\nYour Order:\n\n${orderText}`
  };

  try {
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
