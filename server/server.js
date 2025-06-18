import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "iamsumanth77@gmail.com",
    pass: "uguu ngqg ldxa jldn" // Replace with your App Password
  }
});

app.post("/send-order", async (req, res) => {
  const { cartItems, customerEmail } = req.body;
  console.log("Received order request:", cartItems, customerEmail);

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).send({ success: false, message: "No items in order" });
  }

  // Group by item name and sum quantities
  const itemMap = new Map();
  cartItems.forEach(item => {
    if (itemMap.has(item.name)) {
      itemMap.get(item.name).quantity += item.quantity;
    } else {
      itemMap.set(item.name, { ...item });
    }
  });
  const uniqueItems = Array.from(itemMap.values());

  const orderHTML = uniqueItems
    .map(item => `<li><strong>${item.name}</strong> — Quantity: ${item.quantity}</li>`)
    .join("");

  // Email to owner
  const ownerMail = {
    from: "iamsumanth77@gmail.com",
    to: "rking8885@gmail.com",
    subject: "🍽️ New Food Order Received!",
    html: `
      <h2 style="color: #ff5e00;">New Order Notification</h2>
      <ul style="list-style-type: none; padding-left: 0;">${orderHTML}</ul>
      <p style="font-style: italic;">Order placed by: ${customerEmail || "Unknown"}</p>
    `
  };

  // Email to customer
  const customerMail = {
    from: "iamsumanth77@gmail.com",
    to: customerEmail,
    subject: "🧾 Your Food Order Confirmation",
    html: `
      <h2 style="color: #4CAF50;">Thanks for your order!</h2>
      <p>Here's what we received:</p>
      <ul style="list-style-type: none; padding-left: 0;">${orderHTML}</ul>
      <p>We'll cook it up soon! 🍕🍔</p>
    `
  };

  try {
    console.log("Sending owner email...");
    await transporter.sendMail(ownerMail);
    console.log("✅ Owner email sent");

    if (customerEmail) {
      console.log("Sending confirmation to customer...");
      await transporter.sendMail(customerMail);
      console.log("✅ Customer confirmation sent");
    }

    res.send({ success: true, message: "Emails sent successfully!" });
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
