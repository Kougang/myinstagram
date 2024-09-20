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
      alert("Nom mis à jour avec succès!");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom", error);
      alert("Une erreur est survenue lors de la mise à jour du nom.");
    }
  };

  return (
    <div className="bg-blue-500 text-white flex items-center justify-center  p-3">
      <form onSubmit={handleNameChange}>
        <label>
          Print name :
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="text-black"
          />
        </label>
        <button
          type="submit"
          className=" ml-2 bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Update name
        </button>
      </form>
    </div>
  );
}

export default UpdateDisplayName;
