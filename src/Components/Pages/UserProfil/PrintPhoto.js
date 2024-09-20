import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import app from "./../../../firebase/firebaseConfig";

function PrintPhoto() {
  const auth = getAuth(app);
  const user = auth.currentUser; // L'utilisateur connecté
  const [photoURL, setPhotoURL] = useState("");
  const [displayName, setDisplayName] = useState(""); // Nouvel état pour le nom d'utilisateur

  useEffect(() => {
    if (user) {
      // Récupérer l'URL de la photo de profil
      setPhotoURL(user.photoURL || ""); // Photo par défaut si aucune photo n'est définie
      // Récupérer le nom de l'utilisateur
      setDisplayName(user.displayName || "Utilisateur"); // Afficher "Utilisateur" si aucun nom n'est défini
    }
  }, [user]);

  return (
    <div className=" ">
      <div className="">
        {/* Afficher l'image dans un cercle */}
        {photoURL ? (
          <div className="flex items-center space-x-4 right-2">
            <img
              src={photoURL}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
            <span className="text-lg font-semibold">{displayName}</span>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-200">
            <span className="text-gray-600">No Photo</span>
          </div>
        )}
      </div>
      {/* Afficher le nom de l'utilisateur 
      <div className="mt-2 text-lg font-semibold">{displayName}</div>*/}
    </div>
  );
}

export default PrintPhoto;
