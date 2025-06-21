// src/components/FoodCard.jsx
import React from "react";

const FoodCard = React.memo(({ item, quantity, onAdd, onInc, onDec, itemRef }) => (
  <div className="food-card" ref={itemRef}>
    <img
      src={item.Image}
      alt={item.name}
      className="food-image"
      loading="lazy"
    />
    <h4>{item.name}</h4>
    <p>{item.price}</p>
    {quantity > 0 ? (
      <div className="quantity-controls">
        <button onClick={() => onDec(item)}>➖</button>
        <span>{quantity}</span>
        <button onClick={() => onInc(item)}>➕</button>
      </div>
    ) : (
      <button className="buy-button" onClick={() => onAdd(item)}>
        ADD
      </button>
    )}
  </div>
));

export default FoodCard;
