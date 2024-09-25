import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import ToggleButton from "./ToggleButton";
import DropdownList from "./DropdownList";
import SignInUp from "../../Pages/SignInUp/SignInUp";

function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false); // Ferme le menu après avoir cliqué sur un lien
  };

  return (
    <div className="relative">
      <ToggleButton toggleMenu={toggleMenu} />
      {isOpen && <DropdownList closeMenu={closeMenu} />}
    </div>
  );
}

export default DropdownMenu;