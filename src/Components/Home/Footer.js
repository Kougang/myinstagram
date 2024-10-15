import React from "react";
function Footer() {
  return (
    <div className="flex flex-col   space-y-4 bg-blue-900 py-4 w-full ">
      <footer className="items-center justify-center ">
        <div className="flex flex-row     justify-between p-6  xs:p-2 text-white w-full ">
          <div className="flex flex-col space-y-2 ">
            <p className="hover:text-gray-400 cursor-pointer">About</p>
            <p className="hover:text-gray-400 cursor-pointer">Contacts</p>
            <p className="hover:text-gray-400 cursor-pointer">Download</p>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="hover:text-gray-400 cursor-pointer">Help</p>
            <p className="hover:text-gray-400 cursor-pointer">Faq</p>
            <p className="hover:text-gray-400 cursor-pointer">Github</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
