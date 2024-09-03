import React from "react";
import "./Popup.css";

const handleClick = () => {
  window.location.reload();
};
const Popup = ({ message }) => {
  return (
    <div className="Popup-overlay">
      <div className="Popup-content">
        <button className="close-button" onClick={handleClick}>
          &times;
        </button>
        {message}
      </div>
    </div>
  );
};

export default Popup;
