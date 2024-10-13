// handleDeleteComment.js
import { getDatabase, ref, remove } from "firebase/database";
import app from "./../../firebase/firebaseConfig";

const handleDeleteComment = (postId, commentId, postType, setPosts) => {
  const db = getDatabase(app);
  const commentRef = ref(
    db,
    `posts/${postType}/${postId}/comments/${commentId}`
  );

  // Suppression dans Firebase
  remove(commentRef)
    .then(() => {
      // Mettre à jour l'état local pour supprimer le commentaire de l'affichage
      setPosts((prevPosts) => {
        return prevPosts.map((post) => {
          if (post.id === postId) {
            const updatedComments = { ...post.comments };
            delete updatedComments[commentId];
            return { ...post, comments: updatedComments };
          }
          return post;
        });
      });
    })
    .catch((error) => console.error("Error deleting comment:", error));
};

export default handleDeleteComment;
