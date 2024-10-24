import React from "react";
import { Link } from "react-router-dom";

function DropdownList({ closeMenu, handleSignOut }) {
  return (
    <div className="absolute ">
      <div className="  top-0 mt-0 w-40 bg-white border border-gray-300 rounded shadow-lg ">
        <ul className="py-1">
          <li>
            <Link
              to="/Main/Home"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={closeMenu} // Ferme le menu après un clic
            >
              Home Page
            </Link>
          </li>
          <li>
            <Link
              to="/Main/parameter"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={closeMenu} // Ferme le menu après un clic
            >
              Settings
            </Link>
          </li>
          <li>
            <Link
              to="/Main/contact"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={closeMenu} // Ferme le menu après un clic
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              to="/Main/about"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={closeMenu} // Ferme le menu après un clic
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/Main/bibliographie"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={closeMenu} // Ferme le menu après un clic
            >
              Bibliographie
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DropdownList;
