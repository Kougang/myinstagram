import React, { useEffect, useState } from "react";
import app from "./../../firebase/firebaseConfig";
import { getDatabase, ref, onValue, update, push } from "firebase/database";
import { v4 as uuidv4 } from "uuid"; // Assurez-vous d'importer uuid

function ReadPost() {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [newReply, setNewReply] = useState({});
  const [likes, setLikes] = useState({});

  useEffect(() => {
    const db = getDatabase(app);
    const postTypes = ["text", "image", "video", "audio"];

    postTypes.forEach((postType) => {
      const postRef = ref(db, `posts/${postType}`);

      onValue(postRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const newPosts = Object.keys(data).map((postId) => ({
            id: postId,
            ...data[postId],
          }));

          setPosts((prevPosts) => {
            const updatedPosts = [...prevPosts];

            newPosts.forEach((newPost) => {
              if (!prevPosts.some((post) => post.id === newPost.id)) {
                updatedPosts.push(newPost);
              }
            });

            return updatedPosts;
          });
        }
      });
    });
  }, []);

  const handleLike = (postId, postType) => {
    const db = getDatabase(app);
    const postRef = ref(db, `posts/${postType}/${postId}/likes`);

    update(postRef, {
      likes: (likes[postId] || 0) + 1,
    });

    setLikes((prevLikes) => ({
      ...prevLikes,
      [postId]: (prevLikes[postId] || 0) + 1,
    }));
  };

  const handleCommentSubmit = (postId, postType, parentCommentId = null) => {
    const db = getDatabase(app);
    const commentRef = parentCommentId
      ? ref(
          db,
          `posts/${postType}/${postId}/comments/${parentCommentId}/replies`
        )
      : ref(db, `posts/${postType}/${postId}/comments`);

    const commentText = parentCommentId ? newReply[postId] : newComment[postId];
    const newCommentId = uuidv4(); // Créer un nouvel ID unique

    push(commentRef, {
      id: newCommentId,
      text: commentText,
      createdAt: new Date().toISOString(),
    });

    // Mettre à jour l'état local pour afficher immédiatement le commentaire ou la réponse
    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.id === postId) {
          const updatedComments = { ...post.comments };
          if (!updatedComments) updatedComments = {};
          if (parentCommentId) {
            if (!updatedComments[parentCommentId].replies) {
              updatedComments[parentCommentId].replies = {};
            }
            updatedComments[parentCommentId].replies[newCommentId] = {
              text: commentText,
            };
          } else {
            updatedComments[newCommentId] = { text: commentText, replies: {} };
          }
          return { ...post, comments: updatedComments };
        }
        return post;
      });
    });

    // Réinitialiser les champs de commentaire ou de réponse
    if (parentCommentId) {
      setNewReply((prev) => ({ ...prev, [postId]: "" }));
    } else {
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  const handleCommentChange = (e, postId) => {
    setNewComment((prev) => ({ ...prev, [postId]: e.target.value }));
  };

  const handleReplyChange = (e, postId) => {
    setNewReply((prev) => ({ ...prev, [postId]: e.target.value }));
  };

  return (
    <div className="flex items-center justify-center bg-slate-900 w-full min-h-screen py-10">
      <section className="bg-blue-500 text-slate-900 flex flex-col items-center justify-center space-y-8 p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold">Posts</h1>

        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="post-item w-full bg-gray-800 p-6 mb-6 rounded-lg shadow-md"
            >
              <p className="mb-4 text-white text-center">{post.description}</p>

              {/* Afficher le contenu selon le type */}
              {post.type === "text" && <p className="mb-4">{post.content}</p>}
              {post.type === "image" && (
                <img
                  className="mb-4 w-full max-w-sm rounded-lg"
                  src={post.content}
                  alt={post.description}
                />
              )}
              {post.type === "video" && (
                <video className="mb-4 w-full max-w-sm rounded-lg" controls>
                  <source src={post.content} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {post.type === "audio" && (
                <audio className="mb-4" controls>
                  <source src={post.content} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}

              {/* Bouton de like */}
              <button
                onClick={() => handleLike(post.id, post.type)}
                className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
              >
                Like: {likes[post.id] || post.likes?.likes || 0}
              </button>

              {/* Zone de commentaires */}
              <div className="bg-gray-700 p-4 rounded-lg space-y-4">
                <h3 className="text-xl font-semibold">Comments</h3>

                {post.comments ? (
                  Object.keys(post.comments).map((commentId) => (
                    <div
                      key={commentId}
                      className="border-b border-gray-500 pb-4 mb-4"
                    >
                      <p className="text-gray-300">
                        {post.comments[commentId].text}
                      </p>

                      {/* Répondre à un commentaire */}
                      <div className="flex items-center space-x-4 mt-4">
                        <input
                          type="text"
                          value={newReply[post.id] || ""}
                          onChange={(e) => handleReplyChange(e, post.id)}
                          placeholder="Reply to this comment"
                          className="flex-1 p-2 rounded border border-gray-300 focus:outline-none"
                        />
                        <button
                          onClick={() =>
                            handleCommentSubmit(post.id, post.type, commentId)
                          }
                          className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded"
                        >
                          Reply
                        </button>
                      </div>

                      {/* Afficher les réponses */}
                      {post.comments[commentId].replies &&
                        Object.keys(post.comments[commentId].replies).map(
                          (replyId) => (
                            <p
                              key={replyId}
                              className="ml-6 mt-2 text-gray-400"
                            >
                              {post.comments[commentId].replies[replyId].text}
                            </p>
                          )
                        )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-300">No comments yet.</p>
                )}

                {/* Ajouter un commentaire */}
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={newComment[post.id] || ""}
                    onChange={(e) => handleCommentChange(e, post.id)}
                    placeholder="Add a comment"
                    className="flex-1 p-2 rounded border border-gray-300 focus:outline-none"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id, post.type)}
                    className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </section>
    </div>
  );
}

export default ReadPost;
