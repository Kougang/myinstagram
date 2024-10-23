import React, { useState } from "react";

const UserProfilPost = ({ posts, userId }) => {
  const [isExpanded, setIsExpanded] = useState({});

  const toggleReadMore = (postId) => {
    setIsExpanded((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="post-item w-full bg-gray-500 p-6 xs:p-3 mb-6 rounded-lg shadow-md"
          >
            {/* Afficher le nom et la photo de profil de l'utilisateur qui a fait le post avec la description du post */}
            <div className="flex flex-col mb-4">
              {post.userProfilePhoto ? (
                <div className="flex mb-4">
                  <img
                    src={post.userProfilePhoto}
                    alt={post.userName}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span>{post.userName}</span>
                </div>
              ) : (
                <div className="flex mb-4">
                  <img className="w-8 h-8 rounded-full mr-2" alt="default" />
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
          </div>
        ))
      ) : (
        <div>No posts available</div>
      )}
    </div>
  );
};

export default UserProfilPost;
