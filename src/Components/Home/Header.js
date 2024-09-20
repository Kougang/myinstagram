import React from "react";
import PrintPhoto from "../Pages/UserProfil/PrintPhoto";
import Main from "../Menu/Main";

function Header() {
  return (
    <div className="flex flex-col  space-y-4 bg-blue-900 py-4 w-full ">
      <div className="items-center justify-center ">
        <h1 className="text-white text-2xl font-bold text-center ">
          My Insta App
        </h1>
        <hr />
      </div>

      <div className="flex ">
        <PrintPhoto />
        <Main />
      </div>
    </div>
  );
}

export default Header;
