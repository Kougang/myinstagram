import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import ToggleButton from "./ToggleButton";
import DropdownList from "./DropdownList";

function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false); // Ferme le menu après avoir cliqué sur un lien
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Déconnexion réussie");
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="relative">
      <ToggleButton toggleMenu={toggleMenu} />
      {isOpen && (
        <DropdownList closeMenu={closeMenu} handleSignOut={handleSignOut} />
      )}
    </div>
  );
}

export default DropdownMenu;
