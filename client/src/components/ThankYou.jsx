import React from "react";
import { useNavigate } from "react-router-dom";

function ThankYou() {
  const navigate = useNavigate();

  const goToMenu = () => {
    navigate("/"); // Change this to "/products" or your home route if needed
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}> Thank you for your order!</h2>
      <p style={styles.text}>We’ve emailed your confirmation. Hope you’re hungry!</p>
      <button onClick={goToMenu} style={styles.button}>
       Back to Menu
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: 40,
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#fff8f1",
    minHeight: "100vh"
  },
  heading: {
    color: "#e65c00",
    fontSize: "28px",
    marginBottom: "16px"
  },
  text: {
    color: "#555",
    fontSize: "18px"
  },
  button: {
    marginTop: 30,
    padding: "10px 24px",
    backgroundColor: "#ff6b00",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer"
  }
};

export default ThankYou;
