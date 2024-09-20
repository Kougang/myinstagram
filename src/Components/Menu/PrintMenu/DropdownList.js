import React from "react";
import { Link } from "react-router-dom";

function DropdownList({ closeMenu, handleSignOut }) {
  return (
    <div className=" w-2/5 fixed  right-10  ">
      <div className="fixed  top-20 mt-10 w-40 bg-white border border-gray-300 rounded shadow-lg z-50">
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
              Parameter
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

          <button
            onClick={handleSignOut}
            className="bg-red-900 px-0 py-2 w-full -mb-1 mr-1 text-white rounded hover:bg-blue-700"
          >
            Sign Out
          </button>
        </ul>
      </div>
    </div>
  );
}

export default DropdownList;
