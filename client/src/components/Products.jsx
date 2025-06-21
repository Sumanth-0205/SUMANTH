
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Products() {
  const [cartItems, setCartItems] = useState([]);
  const [customerEmail, setCustomerEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const itemRefs = useRef({});
  const navigate = useNavigate();

  const foodMenu = [
    { id: 1, name: "Pizza", price: "₹250", category: "Main Course",Image:"/images/pizza.webp" },
    { id: 2, name: "Burger", price: "₹180", category: "Main Course",Image:"/images/burger.webp" },
    { id: 3, name: "Noodles", price: "₹150", category: "Main Course",Image:"/images/noodles.webp" },
    { id: 4, name: "Paneer Tikka", price: "₹200", category: "Main Course",Image:"/images/paneertikka.webp" },
    { id: 5, name: "Fries", price: "₹90", category: "Snacks",Image:"/images/fries.webp" },
    { id: 6, name: "Samosa", price: "₹30", category: "Snacks",Image:"/images/samosa.webp" },
    { id: 7, name: "Sandwich", price: "₹120", category: "Snacks",Image:"/images/sandwich.webp" },
    { id: 8, name: "Pakoda", price: "₹60", category: "Snacks",Image:"/images/pakoda.webp" },
    { id: 9, name: "Salad", price: "₹130", category: "Healthy",Image:"/images/salad.webp" },
    { id: 10, name: "Fruit Bowl", price: "₹140", category: "Healthy",Image:"/images/fruitbowl.webp" },
    { id: 11, name: "Sprouts", price: "₹100", category: "Healthy",Image:"/images/sprouts.webp" },
    { id: 12, name: "Veg Soup", price: "₹110", category: "Healthy",Image:"/images/soup.webp" },
    { id: 13, name: "Ice Cream", price: "₹100", category: "Dessert",Image :"/images/icecream.webp" },
    { id: 14, name: "Gulab Jamun", price: "₹90", category: "Dessert" ,Image:"/images/julabjanum.webp"},
    { id: 15, name: "Chocolate Brownie", price: "₹150", category: "Dessert",Image:"/images/brownie..webp" },
    { id: 16, name: "Cake", price: "₹80", category: "Dessert",Image:"/images/cake.webp" }
  ];

  const addToCart = (item) => {
    const exists = cartItems.find(i => i.name === item.name);
    if (!exists) setCartItems([...cartItems, { ...item, quantity: 1 }]);
  };

  const increaseQuantity = (item) => {
    setCartItems(prev =>
      prev.map(p =>
        p.name === item.name && p.quantity < 10
          ? { ...p, quantity: p.quantity + 1 }
          : p
      )
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

  const calculateTotal = () =>
    cartItems.reduce((total, item) => {
      const price = parseInt(item.price.replace("₹", ""));
      return total + item.quantity * price;
    }, 0);

  const handleCheckout = () => {
    if (!customerEmail || !customerEmail.includes("@")) {
      alert("Please enter a valid email before proceeding.");
      return;
    }

    navigate("/payment", {
      state: {
        total: calculateTotal(),
        customerEmail,
        cartItems
      }
    });
  };

  const filteredMenu = foodMenu.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search food..."
        value={searchQuery}
        onChange={(e) => {
          const value = e.target.value;
          setSearchQuery(value);
          const match = foodMenu.find(f =>
            f.name.toLowerCase().includes(value.toLowerCase())
          );
          if (match && itemRefs.current[match.name]) {
            itemRefs.current[match.name].scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
          }
        }}
        style={{
          padding: "8px",
          marginBottom: "16px",
          width: "100%",
          maxWidth: "400px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      
   {filteredMenu.length === 0 ? (
  <div style={{ textAlign: "center", marginTop: 40, color: "#888" }}>
    <h3>😕 No results found</h3>
    <p>Try searching for something else!</p>
  </div>
) : (
  ["Main Course", "Snacks", "Healthy", "Dessert"].map(category => (
    <div key={category}>
      <h3>{category}</h3>
      <div className="menu-grid">
      
        {filteredMenu
          .filter(item => item.category === category)
          .map(item => (
            <div
              className="food-card"
              key={item.id}
              ref={(el) => (itemRefs.current[item.name] = el)}
            >
              <img src ={item.Image} alt={item.Image} className="food-image" loading="lazy"/>
              <h4>{item.name}</h4>
              <p>{item.price}</p>
              {getQuantity(item.name) > 0 ? (
                <div className="quantity-controls">
                  <button onClick={() => decreaseQuantity(item)}>➖</button>
                  <span>{getQuantity(item.name)}</span>
                  <button onClick={() => increaseQuantity(item)}>➕</button>
                </div>
              ) : (
                <button className="buy-button" onClick={() => addToCart(item)}>
                  ADD
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  ))
)}


      {cartItems.length > 0 && (
        <div className="cart-section">
          <h3>Your Cart</h3>
          <ul>
            {cartItems.map((item, index) => {
              const price = parseInt(item.price.replace("₹", ""));
              return (
                <li key={index}>
                  {item.name} — ₹{price} × {item.quantity} = ₹{price * item.quantity}
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
          <button onClick={handleCheckout} className="submit-order" style={{ marginTop: "10px" }}>
            Proceed to Payment
          </button>
        </div>
      )}

      <style>{`
        body, html {
          margin: 0;
          padding: 0;
          background-color: #f8f1e8;
        }
        .container {
          padding: 20px;
          font-family: 'Poppins', sans-serif;
          background-color: #f8f1e8;
        }
        h1, h2, h3, h4 {
          color: #e65c00;
        }
        .menu-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
        }
        .food-card {
          border: 1px solid #ddc1a3;
          padding: 12px;
          border-radius: 8px;
          width: 160px;
          text-align: center;
          background: #fff1e5;
          box-shadow: 2px 2px 6px rgba(0,0,0,0.05);
        }
        .food-card:hover {
          background: #ffe1c2;
        }
          .food-image{
          width:100%;
          height:50%;
          object-fit:cover;
          border-radius:6px;
          margin-bottom:8px;
          
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
        }
      `}</style>
    </div>
  );
}

export default Products;
