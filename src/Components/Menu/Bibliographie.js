import React from "react";
import Footer from "../Home/Footer";
import Header from "../Home/Header";

function Bibliographie() {
  return (
    <div className=" min-h-screen flex items-center justify-center  bg-gray-800">
      <main className=" h-full bg-blue-500 text-white flex flex-col w-2/5  ">
        <div className="">
          <Header />
        </div>
        <h1 className="text-center p-2 text-white">Bibliography</h1> <hr />
        <hr />
        <hr />
        <hr />
        <p className="text-center p-2 text-white mb-40">Description about</p>
        <Footer />
      </main>
    </div>
  );
}

export default Bibliographie;
