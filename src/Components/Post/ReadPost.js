import React, { useEffect, useState } from "react";
import app from "./../../firebase/firebaseConfig";
import { PaperAirplaneIcon } from "@heroicons/react/solid";
import { getDatabase, ref, onValue, push, remove } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import HandleStickerLike from "./HandleStickerLike";
import UserProfilePosts from "./UserProfilePosts";
import FollowButton from "./FollowButton";

function ReadPost({ user }) {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [newReply, setNewReply] = useState({});
  const [flag, setFlag] = useState(false);
  const [uName, setUName] = useState("");
  const [uProfilePhoto, setUProfilePhoto] = useState("");
  const [isExpanded, setIsExpanded] = useState({});
  const [stickers, setStickers] = useState({});
  const [totalLikes, setTotalLikes] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);

  // console.log("totalLikes", totalLikes);

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

  const handleCommentSubmit = (postId, postType, parentCommentId = null) => {
    if (flag === false) {
      return;
    }
    const db = getDatabase(app);
    const commentRef = parentCommentId
      ? ref(
          db,
          `posts/${postType}/${postId}/comments/${parentCommentId}/replies`
        )
      : ref(db, `posts/${postType}/${postId}/comments`);

    const commentText = parentCommentId
      ? newReply[postId]?.[parentCommentId]
      : newComment[postId];
    const newCommentId = uuidv4(); // Créer un nouvel ID unique

    setUName(user?.displayName);
    setUProfilePhoto(user?.photoURL);

    const newCommentData = {
      id: newCommentId,
      text: commentText,
      createdAt: new Date().toISOString(),
      userId: user?.uid,
      userName: user?.displayName,
      userProfilePhoto: user?.photoURL,
    };

    // Ajouter le commentaire dans Firebase
    push(commentRef, newCommentData);

    // Mettre à jour l'état local pour afficher immédiatement le commentaire ou la réponse
    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.id === postId) {
          const updatedComments = { ...post.comments };

          if (parentCommentId) {
            if (!updatedComments[parentCommentId].replies) {
              updatedComments[parentCommentId].replies = {};
            }
            updatedComments[parentCommentId].replies[newCommentId] = {
              ...newCommentData,
            };
          } else {
            updatedComments[newCommentId] = {
              ...newCommentData,
              replies: {},
            };
          }
          return { ...post, comments: updatedComments };
        }
        return post;
      });
    });

    // Réinitialiser les champs de commentaire ou de réponse
    if (parentCommentId) {
      setNewReply((prev) => ({
        ...prev,
        [postId]: { ...prev[postId], [parentCommentId]: "" },
      }));
    } else {
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
    }
    setFlag(false);
  };

  const handleCommentChange = (e, postId) => {
    setNewComment((prev) => ({ ...prev, [postId]: e.target.value }));
    setFlag(true);
  };

  const handleReplyChange = (e, postId, commentId) => {
    setFlag(true);
    setNewReply((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        [commentId]: e.target.value,
      },
    }));
  };

  // Fonction pour supprimer un post
  const handleDeletePost = (postId, postType) => {
    const db = getDatabase(app);
    const postRef = ref(db, `posts/${postType}/${postId}`);

    // Suppression dans Firebase
    remove(postRef)
      .then(() => {
        // Mettre à jour l'état local pour supprimer le post de l'affichage
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      })
      .catch((error) => console.error("Error deleting post:", error));
  };

  // Fonction pour supprimer un commentaire
  const handleDeleteComment = (postId, commentId, postType) => {
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
              delete updatedComments[commentId]; // Supprimer le commentaire de l'objet
              return { ...post, comments: updatedComments };
            }
            return post;
          });
        });
      })
      .catch((error) => console.error("Error deleting comment:", error));
  };

  const toggleReadMore = (postId) => {
    setIsExpanded((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Fonction de callback pour recevoir la mise à jour du total des likes
  const handleTotalLikesChange = (newTotalLikes) => {
    setTotalLikes(newTotalLikes); // Mettre à jour le total des likes
  };

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    const filtered = posts.filter((post) => post.userId === userId);
    setFilteredPosts(filtered);
  };

  return (
    <div className="flex items-center justify-center bg-slate-900 w-full min-h-screen py-10">
      {/* Afficher les posts de l'utilisateur cliqué */}
      {selectedUserId ? (
        <UserProfilePosts
          posts={filteredPosts}
          userId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
        />
      ) : (
        <section className="bg-blue-500 text-slate-900 flex flex-col items-center justify-center space-y-8 p-8 xs:p-3 rounded-lg shadow-lg w-full max-w-4xl">
          <h1 className="text-3xl font-bold">Posts</h1>

          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="post-item w-full bg-gray-500 p-6 xs:p-3 mb-6 rounded-lg shadow-md"
              >
                {/* Afficher le nom et la photo de profil de l'utilisateur qui a fait le post avec la description du post */}
                <div className="flex flex-col mb-4">
                  {post.userProfilePhoto ? (
                    <div>
                      <div className="flex flex-rows ">
                        <div
                          onClick={() => handleUserClick(post.userId)}
                          className="flex mb-4 cursor-pointer"
                        >
                          <img
                            src={post.userProfilePhoto}
                            alt={post.userName}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span>{post.userName}</span>
                        </div>
                        <div onClick={() => handleUserClick(post.userId)}>
                          <span className="ml-4 mtext-gray-300 text-sm">
                            {new Date(post.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="ml-4 ">
                          {/* Bouton de suivi */}
                          {post.userId !== user?.uid && (
                            <FollowButton
                              currentUserId={user?.uid}
                              targetUserId={post.userId}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex mb-4">
                      <img className="w-8 h-8 rounded-full mr-2" />
                      <span>{post.userName}</span>
                    </div>
                  )}

                  <p className="mb-4 text-white text-center items-center break-words">
                    {isExpanded[post.id] || post.description.length <= 100
                      ? post.description
                      : `${post.description.slice(0, 100)}...`}
                    {post.description.length > 100 && (
                      <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => toggleReadMore(post.id)}
                      >
                        {isExpanded[post.id] ? " Read less" : "Read more"}
                      </span>
                    )}
                  </p>
                </div>

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
                  <audio className="mb-4 w-full max-w-sm rounded-lg" controls>
                    <source src={post.content} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}

                {/* Bouton de suppression du post, visible uniquement si l'utilisateur est le propriétaire */}
                {user?.uid === post.userId && (
                  <button
                    onClick={() => handleDeletePost(post.id, post.type)}
                    className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded mb-4 ml-4"
                  >
                    Delete Post
                  </button>
                )}

                {/* like stiker */}
                <HandleStickerLike
                  postId={post.id}
                  postType={post.type}
                  stickers={stickers}
                  setStickers={setStickers}
                  onTotalChange={handleTotalLikesChange}
                  userID={user?.uid}
                />

                {/* Zone de commentaires */}
                <div className="bg-gray-700 p-4 rounded-lg space-y-2 xs:p-2">
                  <h3 className="text-xl font-semibold">Comments</h3>

                  {post.comments ? (
                    Object.keys(post.comments).map((commentId) => (
                      <div
                        key={commentId}
                        className="border-b border-gray-500 pb-4 mb-4"
                      >
                        {/* Afficher le nom et la photo de profil de l'utilisateur qui a fait le commentaire */}
                        <div className="flex items-center mb-2">
                          {post.comments[commentId]?.userProfilePhoto ? (
                            <div className="flex">
                              <img
                                src={post.comments[commentId]?.userProfilePhoto}
                                alt="pro.pic"
                                className="w-6 h-6 rounded-full mr-2"
                              />
                              <p className="text-gray-400">
                                {post.comments[commentId]?.userName}
                              </p>
                              <p className="ml-2 text-gray-400 ">
                                {new Date(
                                  post.comments[commentId].createdAt
                                ).toLocaleString()}
                              </p>
                            </div>
                          ) : (
                            <div className="flex">
                              <img
                                src={uProfilePhoto}
                                alt="pro.pic"
                                className="w-6 h-6 rounded-full mr-2"
                              />
                              <p className="text-gray-400">
                                {post.comments[commentId]?.userName || uName}
                              </p>
                              <p className="ml-2 text-gray-400 text-xs">
                                {new Date(
                                  post.comments[commentId].createdAt
                                ).toLocaleString()}
                              </p>
                            </div>
                          )}

                          {/* Bouton de suppression de commentaire si tu es l'auteur du commentaire */}
                          {post.comments[commentId]?.userId === user?.uid && (
                            <button
                              onClick={() =>
                                handleDeleteComment(
                                  post.id,
                                  commentId,
                                  post.type,
                                  setPosts
                                )
                              }
                              className="bg-red-500 hover:bg-red-400 text-white py-1 px-2 rounded mt-2 ml-2"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <div className="flex">
                          <p className="text-gray-300">
                            {post.comments[commentId].text}
                          </p>
                        </div>

                        {/* Répondre à un commentaire */}
                        <div className="flex items-center space-x-2 sm:space-x-4 mt-4">
                          <input
                            type="text"
                            value={newReply[post.id]?.[commentId] || ""}
                            onChange={(e) =>
                              handleReplyChange(e, post.id, commentId)
                            }
                            placeholder="Reply to this comment"
                            className="flex-1 p-1 sm:p-2 text-xs sm:text-sm rounded border border-gray-300 focus:outline-none xs:p-0 xs:text-xs w-full max-w-sm"
                          />

                          <button
                            onClick={() =>
                              handleCommentSubmit(post.id, post.type, commentId)
                            }
                            className="bg-green-600 hover:bg-green-500 text-white py-1 px-2 sm:py-2 xs:px-0 xs:pl-1 text-xs sm:text-sm rounded rounded"
                          >
                            <PaperAirplaneIcon className="w-5 h-3 text-white transform rotate-45" />
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
                                {typeof post.comments[commentId].replies[
                                  replyId
                                ].text === "string"
                                  ? post.comments[commentId].replies[replyId]
                                      .text
                                  : "Invalid reply format"}
                              </p>
                            )
                          )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-300">No comments yet.</p>
                  )}

                  {/* Ajouter un commentaire */}
                  <div className="flex items-center space-x-4 xs:space-x-1">
                    <input
                      type="text"
                      value={newComment[post.id] || ""}
                      onChange={(e) => handleCommentChange(e, post.id)}
                      placeholder="Add a comment"
                      required
                      className="flex-1 p-1 sm:p-2 text-xs sm:text-sm rounded border border-gray-300 focus:outline-none xs:p-1 xs:text-xs w-full max-w-sm"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id, post.type)}
                      className="bg-blue-600 hover:bg-blue-500 text-white py-1 px-2 sm:py-2 xs:px-1 xs:pl-1 text-xs sm:text-sm rounded rounded"
                    >
                      <PaperAirplaneIcon className="w-5 h-4 text-white transform rotate-45" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No posts available</p>
          )}
        </section>
      )}
    </div>
  );
}

export default ReadPost;
