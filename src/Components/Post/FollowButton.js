// FollowButton.js
import React, { useEffect, useState } from "react";
import { getDatabase, ref, set, remove, onValue } from "firebase/database";
import app from "./../../firebase/firebaseConfig";

function FollowButton({ currentUserId, targetUserId }) {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const db = getDatabase(app);
    const followRef = ref(db, `followers/${currentUserId}/${targetUserId}`);

    // Vérifie si l'utilisateur suit déjà le profil cible
    const unsubscribe = onValue(followRef, (snapshot) => {
      setIsFollowing(snapshot.exists());
    });

    return () => unsubscribe();
  }, [currentUserId, targetUserId]);

  const handleFollow = () => {
    const db = getDatabase(app);
    const followRef = ref(db, `followers/${currentUserId}/${targetUserId}`);

    if (isFollowing) {
      remove(followRef); // Arrête de suivre
    } else {
      set(followRef, true); // Commence à suivre
    }
  };

  return (
    <button
      onClick={handleFollow}
      className={`py-0 px-1 rounded ${
        isFollowing ? "bg-red-500" : "bg-blue-500"
      } text-white`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}

export default FollowButton;
