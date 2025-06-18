import React, { useState } from "react";
import axios from "axios";

function Products() {
  const [cartItems, setCartItems] = useState([]);
  const [customerEmail, setCustomerEmail] = useState("");

  const foodMenu = [
    { id: 1, name: "Pizza", price: "₹250", quantity: 1, category: "Main Course" },
    { id: 2, name: "Burger", price: "₹180", quantity: 1, category: "Main Course" },
    { id: 3, name: "Noodles", price: "₹150", quantity: 1, category: "Main Course" },
    { id: 4, name: "Paneer Tikka", price: "₹200", quantity: 1, category: "Main Course" },
    { id: 5, name: "Fries", price: "₹90", quantity: 1, category: "Snacks" },
    { id: 6, name: "Samosa", price: "₹30", quantity: 1, category: "Snacks" },
    { id: 7, name: "Sandwich", price: "₹120", quantity: 1, category: "Snacks" },
    { id: 8, name: "Pakora", price: "₹60", quantity: 1, category: "Snacks" },
    { id: 9, name: "Salad", price: "₹130", quantity: 1, category: "Healthy" },
    { id: 10, name: "Fruit Bowl", price: "₹140", quantity: 1, category: "Healthy" },
    { id: 11, name: "Sprouts", price: "₹100", quantity: 1, category: "Healthy" },
    { id: 12, name: "Veg Soup", price: "₹110", quantity: 1, category: "Healthy" },
    { id: 13, name: "Ice Cream", price: "₹100", quantity: 1, category: "Dessert" },
    { id: 14, name: "Gulab Jamun", price: "₹90", quantity: 1, category: "Dessert" },
    { id: 15, name: "Chocolate Brownie", price: "₹150", quantity: 1, category: "Dessert" },
    { id: 16, name: "Rasgulla", price: "₹80", quantity: 1, category: "Dessert" }
  ];

  const addToCart = (item) => {
    const exists = cartItems.find(i => i.name === item.name);
    if (!exists) setCartItems([...cartItems, { ...item }]);
  };

  const increaseQuantity = (item) => {
    setCartItems(prev =>
      prev.map(p => p.name === item.name ? { ...p, quantity: p.quantity + 1 } : p)
    );
  };

  const decreaseQuantity = (item) => {
    setCartItems(prev =>
      prev
        .map(p => p.name === item.name ? { ...p, quantity: p.quantity - 1 } : p)
        .filter(p => p.quantity > 0)
    );
  };

  const getQuantity = (name) => {
    const item = cartItems.find(i => i.name === name);
    return item ? item.quantity : 0;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseInt(item.price.replace("₹", ""));
      return total + item.quantity * price;
    }, 0);
  };

  const handleBuyClick = async () => {
    if (!customerEmail) {
      alert("Please enter your email before placing the order.");
      return;
    }

    try {
    await axios.post("https://your-backend-name.onrender.com/send-order", {

        cartItems,
        customerEmail
      });
      alert("✅ Order confirmed! A confirmation has been emailed to you.");
      setCartItems([]);
      setCustomerEmail("");
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Failed to place order. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Food Menu</h2>

      {["Main Course", "Snacks", "Healthy", "Dessert"].map(category => (
        <div key={category}>
          <h3>{category}</h3>
          <div className="menu-grid">
            {foodMenu.filter(item => item.category === category).map(item => (
              <div className="food-card" key={item.id}>
                <h4>{item.name}</h4>
                <p>{item.price}</p>
                {getQuantity(item.name) > 0 ? (
                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(item)}>➖</button>
                    <span>{getQuantity(item.name)}</span>
                    <button onClick={() => increaseQuantity(item)}>➕</button>
                  </div>
                ) : (
                  <button className="buy-button" onClick={() => addToCart(item)}>BUY</button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {cartItems.length > 0 && (
        <div className="cart-section">
          <h3>Your Cart</h3>
          <ul>
            {cartItems.map((item, index) => {
              const price = parseInt(item.price.replace("₹", ""));
              const subtotal = price * item.quantity;
              return (
                <li key={index}>
                  {item.name} — ₹{price} × {item.quantity} = ₹{subtotal}
                </li>
              );
            })}
          </ul>
          <p><strong>Total: ₹{calculateTotal()}</strong></p>

          <input
            type="email"
            placeholder="Enter your email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="email-input"
          />
          <br />
          <button onClick={handleBuyClick} className="submit-order">BUY</button>
        </div>
      )}

      <style>{`
        .container {
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        h2, h3 {
          color: #e65c00;
        }
        .menu-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
        }
        .food-card {
          border: 1px solid #ccc;
          padding: 12px;
          border-radius: 8px;
          width: 160px;
          text-align: center;
          background: #fff7f0;
          box-shadow: 2px 2px 6px rgba(0,0,0,0.05);
        }
        .food-card:hover {
          background: #ffe1c2;
          transition: background 0.3s ease-in-out;
        }
        .buy-button, .submit-order {
          background-color: #ff6b00;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
        }
        .buy-button:hover, .submit-order:hover {
          background-color: #e05900;
        }
        .quantity-controls {
          display: flex;
          justify-content: center;
          gap: 10px;
          align-items: center;
        }
        .quantity-controls button {
          padding: 4px 10px;
          border: none;
          background: #eee;
          border-radius: 4px;
          cursor: pointer;
        }
        .quantity-controls button:hover {
          background: #ddd;
        }
        .cart-section {
          margin-top: 30px;
          background: #fdf2e9;
          border: 1px solid #f5cba7;
          padding: 16px;
          border-radius: 10px;
        }
        .email-input {
          padding: 8px;
          width: 250px;
          margin: 10px 0;
          border-radius: 6px;
          border: 1px solid #ccc;
        }
        @media (max-width: 600px) {
          .menu-grid {
            flex-direction: column;
            align-items: center;
          }
          .food-card {
            width: 90%;
          }
        }
      `}</style>
    </div>
  );
}

export default Products;
