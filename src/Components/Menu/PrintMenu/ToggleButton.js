import React from "react";

function ToggleButton({ toggleMenu }) {
  return (
    <button
      className="text-3xl text-blue-500 w-30 h-30    "
      onClick={toggleMenu}
    >
      &#8942;
    </button>
  );
}

export default ToggleButton;
