import React, { useState } from "react";
// import { signOut } from "firebase/auth";
// import { auth } from "../../../firebase/firebaseConfig";
import ToggleButton from "./ToggleButton";
import DropdownList from "./DropdownList";
// import SignInUp from "../../Pages/SignInUp/SignInUp";

function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false); // Ferme le menu après avoir cliqué sur un lien
  };

  return (
    <div className="mr-3">
      <div className="ml-40">
        <ToggleButton toggleMenu={toggleMenu} />
      </div>

      {isOpen && (
        <div className="ml-2">
          <DropdownList closeMenu={closeMenu} />
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
