import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import app from "./../../../firebase/firebaseConfig";

function PrintPhoto() {
  const auth = getAuth(app);
  const user = auth.currentUser;
  const [photoURL, setPhotoURL] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (user) {
      setPhotoURL(user.photoURL || "");
      setDisplayName(user.displayName || "Utilisateur");
    }
  }, [user]);

  return (
    <div className=" ml-2 -mt-2">
      <div className="">
        {/* Afficher l'image dans un cercle */}
        {photoURL ? (
          <div className="flex items-center space-x-0 right-2">
            <img
              src={photoURL}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 "
            />
            <span className="text-lg font-semibold">{displayName}</span>
          </div>
        ) : (
          <div className="flex ">
            <div className="flex   w-24 h-24 rounded-full border-2 border-gray-300  items-center justify-center bg-gray-200 ">
              <span className="text-gray-600 ">No Photo</span>
            </div>
            <span className="text-lg font-semibold pt-10">{displayName}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrintPhoto;
