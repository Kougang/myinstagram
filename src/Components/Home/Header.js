import React from "react";
import PrintPhoto from "../Pages/UserProfil/PrintPhoto";
import DropdownMenu from "../Menu/PrintMenu/DropdownMenu";

function Header({ user }) {
  return (
    <div className="flex  flex-col  space-y-4 bg-blue-900 py-4 w-full h-40 ">
      <div className="items-center justify-center ">
        <h1 className="text-white text-2xl font-bold text-center ">
          My Insta App
        </h1>
        <hr />
      </div>

      {/* Ici on veut que PrintPhoto et Main prennent tout l'espace */}
      <div className="flex w-full ">
        {/* Ajout de flex-grow pour occuper l'espace disponible */}
        <div className="flex-grow ">
          <PrintPhoto />
        </div>

        <nav className="">
          <DropdownMenu />
        </nav>
      </div>
    </div>
  );
}

export default Header;
