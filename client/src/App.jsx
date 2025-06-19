import { BrowserRouter, Routes, Route } from "react-router-dom";
import Products from "./components/Products";
import Payment from "./components/payment";
import ThankYou from "./components/ThankYou";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <h1>Food Ordering App</h1>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/thank-you" element={<ThankYou />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
