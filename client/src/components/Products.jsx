import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FoodCard from "./FoodCard";
import foodMenu from "../foodMenu"; // adjust the path if you move the file


function Products() {
  const [cartItems, setCartItems] = useState([]);
  const [customerEmail, setCustomerEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const itemRefs = useRef({});
  const navigate = useNavigate();

 

  const addToCart = useCallback((item) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.name === item.name);
      return exists ? prev : [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const increaseQuantity = useCallback((item) => {
    setCartItems(prev =>
      prev.map(p =>
        p.name === item.name && p.quantity < 10
          ? { ...p, quantity: p.quantity + 1 }
          : p
      )
    );
  }, []);

  const decreaseQuantity = useCallback((item) => {
    setCartItems(prev =>
      prev
        .map(p => p.name === item.name ? { ...p, quantity: p.quantity - 1 } : p)
        .filter(p => p.quantity > 0)
    );
  }, []);

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

  const filteredMenu = useMemo(() => (
  foodMenu.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
), [searchQuery]);


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
                  <FoodCard
                    key={item.id}
                    item={item}
                    quantity={getQuantity(item.name)}
                    onAdd={addToCart}
                    onInc={increaseQuantity}
                    onDec={decreaseQuantity}
                    itemRef={(el) => (itemRefs.current[item.name] = el)}
                  />
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
        .container {
          padding: 20px;
          font-family: 'Poppins', sans-serif;
          background-color: #f8f1e8;
        }
        h3 {
          color: #e65c00;
        }
        .menu-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
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
