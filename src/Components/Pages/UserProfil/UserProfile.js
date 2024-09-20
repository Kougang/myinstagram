import React from "react";
import UpdateDisplayName from "./UpdateDisplayName";
import UpdateProfilePhoto from "./UpdateProfilePhoto";
import UpdatePassword from "./UpdatePassword";
import ChangePrivacyStatus from "./ChangePrivacyStatus";
import Header from "./../../Home/Header";
import Footer from "../../Home/Footer";

function UserProfile() {
  return (
    // <div className="flex items-center justify-center  bg-gray-800">
    //   <section className="  bg-slate-900 flex flex-col w-2/5  items-center justify-center space-y-4"></section>
    <div className="flex items-center justify-center  bg-gray-800">
      <main className="  bg-slate-900 flex flex-col w-full md:w-2/5  ">
        <Header />
        <h1 className="text-center p-2 text-white"> MANAGE YOUR PROFILE</h1>
        <hr />
        <hr />
        <hr />
        <hr />
        <section>
          <h2 className="text-center p-2 text-white">Change account type</h2>
          <hr />
          <ChangePrivacyStatus />
        </section>

        <hr />
        <hr />
        <hr />
        <hr />

        <section>
          <h2 className="text-center p-2 text-white">Update user name</h2>
          <hr />
          <UpdateDisplayName />
        </section>

        <hr />
        <hr />
        <hr />
        <hr />

        <section>
          <h2 className="text-center p-2 text-white">Update profile picture</h2>
          <hr />
          <UpdateProfilePhoto />
        </section>

        <hr />
        <hr />
        <hr />
        <hr />

        <section>
          <h2 className="text-center p-2 text-white">Update password</h2>
          <hr />
          <UpdatePassword />
        </section>
        <hr />
        <hr />
        <hr />
        <hr />
        <Footer />
      </main>
    </div>
  );
}

export default UserProfile;
