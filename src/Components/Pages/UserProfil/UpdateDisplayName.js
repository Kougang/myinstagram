import React, { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import app from "./../../../firebase/firebaseConfig";

function UpdateDisplayName() {
  const auth = getAuth(app);
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || "");

  const handleNameChange = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(user, { displayName });
      alert("Name succes update!");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom", error);
      alert("Une erreur est survenue lors de la mise à jour du nom.");
    }
  };

  return (
    <div className="bg-blue-500 text-white flex items-center justify-center  p-3 ">
      <form
        onSubmit={handleNameChange}
        className="xs:flex flex-col xs:flex items-center xs:justify-center"
      >
        <label for="lab">Print name :</label>
        <input
          type="text"
          id="lab"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="text-black"
        />

        <button
          type="submit"
          className=" ml-2 bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700 xs:px-2 xs:mt-1"
        >
          Update name
        </button>
      </form>
    </div>
  );
}

export default UpdateDisplayName;
