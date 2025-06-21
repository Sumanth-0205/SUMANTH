// src/ThankYou.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function ThankYou() {
  const navigate = useNavigate();

  const goToMenu = () => {
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🎉 Thank you for your order!</h2>
      <p style={styles.text}>
        We’ve emailed your confirmation. Hope you’re hungry!
      </p>
      <button onClick={goToMenu} style={styles.button}>
        Back to Menu
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#fff8f1",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    color: "#e65c00",
    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
    marginBottom: "16px",
  },
  text: {
    color: "#555",
    fontSize: "1.2rem",
  },
  button: {
    marginTop: 30,
    padding: "10px 24px",
    backgroundColor: "#ff6b00",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
  },
};

export default ThankYou;
