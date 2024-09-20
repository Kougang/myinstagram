import React, { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import app from "./../../../firebase/firebaseConfig";

function UpdateProfilePhoto() {
  const auth = getAuth(app);
  const user = auth.currentUser;
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  const handlePhotoChange = async (e) => {
    e.preventDefault();
    if (profilePhoto) {
      const storage = getStorage(app);
      const fileRef = storageRef(storage, `profilePhotos/${user.uid}`);
      await uploadBytes(fileRef, profilePhoto);
      const newPhotoURL = await getDownloadURL(fileRef);
      await updateProfile(user, { photoURL: newPhotoURL });
      setPhotoURL(newPhotoURL);
      alert("Photo de profil mise à jour avec succès!");
    }
  };

  return (
    <div className="bg-blue-500 text-white flex items-center justify-center  p-3">
      <form onSubmit={handlePhotoChange}>
        {photoURL && (
          <img
            className="border-2 border-black border-solid"
            src={photoURL}
            alt="Profile"
            width="100"
          />
        )}
        <label>
          <input
            type="file"
            onChange={(e) => setProfilePhoto(e.target.files[0])}
          />
        </label>
        <button
          type="submit"
          className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Update picture
        </button>
      </form>
    </div>
  );
}

export default UpdateProfilePhoto;
