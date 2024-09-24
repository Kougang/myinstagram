import React from "react";
import { getDatabase, ref, remove } from "firebase/database";
import app from "./../../firebase/firebaseConfig";

const DeleteButton = ({ postId, postType, commentId = null, onDelete }) => {
  const handleDelete = () => {
    const db = getDatabase(app);

    if (commentId) {
      // Supprimer un commentaire
      const commentRef = ref(
        db,
        `posts/${postType}/${postId}/comments/${commentId}`
      );
      remove(commentRef)
        .then(() => {
          console.log("Commentaire supprimé");
          onDelete(commentId); // Notification au parent après suppression
        })
        .catch((error) =>
          console.error("Erreur lors de la suppression du commentaire:", error)
        );
    } else {
      // Supprimer un post
      const postRef = ref(db, `posts/${postType}/${postId}`);
      remove(postRef)
        .then(() => {
          console.log("Post supprimé");
          onDelete(postId); // Notification au parent après suppression
        })
        .catch((error) =>
          console.error("Erreur lors de la suppression du post:", error)
        );
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 hover:bg-red-500 text-white py-1 px-2 rounded"
    >
      {commentId ? "Delete Comment" : "Delete Post"}
    </button>
  );
};

export default DeleteButton;
