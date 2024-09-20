import React from "react";

function ToggleButton({ toggleMenu }) {
  return (
    <button
      className="text-3xl text-blue-500 md:w-3/5 fixed  right-4 top-20 "
      onClick={toggleMenu}
    >
      &#8942;
    </button>
  );
}

export default ToggleButton;
