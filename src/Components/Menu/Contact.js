import React from "react";
import Header from "../Home/Header";
import Footer from "../Home/Footer";

function Contact() {
  return (
    <div className=" min-h-screen flex items-center justify-center  bg-gray-800">
      <main className=" h-full bg-blue-500 text-white flex flex-col w-full md:w-2/5  ">
        <div className="">
          <Header />
        </div>
        <h1 className="text-center p-2 text-white">Contacts</h1> <hr />
        <hr />
        <hr />
        <hr />
        <ul className="mb-40 text-center">
          <li>Email: kougangsopjio@gmail.com</li>
          <li>Whatsapp: +237 696232247</li>
          <li>Call: +237 682227197</li>
        </ul>
        <Footer />
      </main>
    </div>
  );
}

export default Contact;
