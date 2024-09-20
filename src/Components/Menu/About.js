import React from "react";
import Header from "../Home/Header";
import Footer from "../Home/Footer";

function About() {
  return (
    <div className=" min-h-screen flex items-center justify-center  bg-gray-800">
      <main className=" h-full bg-blue-500 text-white flex flex-col w-2/5  ">
        <div className="">
          <Header />
        </div>
        <h1 className="text-center p-2 text-white">About page</h1> <hr />
        <hr />
        <hr />
        <hr />
        <p className="text-center p-2 text-white mb-40">I learn react js</p>
        <Footer />
      </main>
    </div>
  );
}

export default About;
