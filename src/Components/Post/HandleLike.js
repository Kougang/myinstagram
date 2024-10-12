import React, { useEffect, useState } from "react";
import { getDatabase, ref, update, onValue } from "firebase/database";
import app from "./../../firebase/firebaseConfig";

function HandleLike({ postId, postType }) {
  const [likes, setLikes] = useState(0); // état local pour les likes

  useEffect(() => {
    const db = getDatabase(app);
    const postRef = ref(db, `posts/${postType}/${postId}/likes`);

    // Récupérer le nombre de likes depuis Firebase lors du montage
    onValue(postRef, (snapshot) => {
      if (snapshot.exists()) {
        const postData = snapshot.val();
        setLikes(postData.likes || 0); // S'assurer que likes est un nombre
      }
    });
  }, [postId, postType]);

  const handleLike = () => {
    const db = getDatabase(app);
    const postRef = ref(db, `posts/${postType}/${postId}/likes`);

    // Incrémenter le nombre de likes localement
    setLikes((prevLikes) => {
      const newLikes = prevLikes + 1;

      // Mettre à jour Firebase avec le nouveau nombre de likes
      update(postRef, { likes: newLikes })
        .then(() => {
          console.log("Likes updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating likes:", error);
        });

      return newLikes; // Retourner le nouveau nombre de likes pour l'état local
    });
  };

  return (
    <button
      onClick={handleLike}
      className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
    >
      Like: {likes} {/* Afficher le nombre de likes */}
    </button>
  );
}

export default HandleLike;
