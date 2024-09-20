import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { auth } from "../../../firebase/firebaseConfig";

function ChangePrivacyStatus() {
  const [privacyStatus, setPrivacyStatus] = useState("public"); // par défaut, public
  const [loading, setLoading] = useState(true); // Indicateur de chargement

  const user = auth.currentUser; // Utilisateur connecté

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const privacyRef = ref(db, "users/" + user.uid + "/privacy");

      // Récupérer le statut actuel de la visibilité
      onValue(privacyRef, (snapshot) => {
        if (snapshot.exists()) {
          setPrivacyStatus(snapshot.val());
        } else {
          console.log("No privacy data found, defaulting to public.");
        }
        setLoading(false); // Arrêter le chargement une fois le statut récupéré
      });
    }
  }, [user]);

  const handlePrivacyToggle = () => {
    const newPrivacyStatus = privacyStatus === "public" ? "private" : "public";

    if (user) {
      const db = getDatabase();
      const userRef = ref(db, "users/" + user.uid);

      // Mettre à jour la visibilité
      update(userRef, { privacy: newPrivacyStatus })
        .then(() => {
          console.log("Privacy status updated to:", newPrivacyStatus);
          setPrivacyStatus(newPrivacyStatus); // Mettre à jour l'état local
        })
        .catch((error) => {
          console.error("Error updating privacy status:", error);
        });
    }
  };

  if (loading) {
    return <p>Loading privacy status...</p>;
  }
  // <h2>Changer la visibilité du compte</h2>

  return (
    <div className="bg-blue-500 text-white flex items-center justify-center p-3 xs:flex flex-col ">
      <p>
        <span>Current status:</span> <strong>{privacyStatus}</strong>
      </p>
      <div className="ml-1">
        <button
          onClick={handlePrivacyToggle}
          className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700 xs:text-xs "
        >
          <span className="mr-1 xs:text-xs ">Switch to mode</span>
          <span>{privacyStatus === "public" ? "privé" : "public"}</span>
        </button>
      </div>
    </div>
  );
}

export default ChangePrivacyStatus;
