import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Home/Home";
import Contact from "./Contact";
import About from "./About";
import Bibliographie from "./Bibliographie";
import UserProfile from "../Pages/UserProfil/UserProfile";
import LockOut from "../Pages/LockOut/LockOut";
import DropdownMenu from "./PrintMenu/DropdownMenu";

function Main() {
  return (
    <div className="">
      {/* Menu en haut à droite */}
      <div className="">
        <DropdownMenu />
      </div>

      {/* Routes pour chaque composant */}

      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/parameter" element={<UserProfile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/bibliographie" element={<Bibliographie />} />
        <Route path="/lockout" element={<LockOut />} />
      </Routes>
    </div>
  );
}

export default Main;
