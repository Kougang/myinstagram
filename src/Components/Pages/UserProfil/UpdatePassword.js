import React, { useState } from "react";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import app from "./../../../firebase/firebaseConfig";

function UpdatePassword() {
  const auth = getAuth(app);
  const user = auth.currentUser;
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      alert("Mot de passe mis à jour avec succès!");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe", error);
      alert("Une erreur est survenue lors de la mise à jour du mot de passe.");
    }
  };

  return (
    <div className="bg-blue-500 text-white flex items-center justify-center  p-3">
      <form
        onSubmit={handlePasswordChange}
        className="xs:flex flex-col xs:items-center xs:justify-center "
      >
        <label for="pwd">Current password : </label>
        <input
          type="password"
          id="pwd"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-black m-2 border-2 border-black border-solid"
        />
        <br />

        <label for="npw" className="m-2">
          New password:
        </label>
        <input
          type="password"
          id="npw"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="text-black m-2 border-2 border-black border-solid"
        />
        <button
          type="submit"
          className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700 md:ml-40 "
        >
          Change password
        </button>
      </form>
    </div>
  );
}

export default UpdatePassword;
