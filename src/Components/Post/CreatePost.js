import React, { useState } from "react";
import app from "./../../firebase/firebaseConfig";
import { getDatabase, ref, set } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
// import Home from "../Home/Home";

function CreatePost({ user }) {
  const [description, setDescription] = useState("");
  const [content, setContent] = useState(null);
  const [postType, setPostType] = useState("text");
  const navigate = useNavigate();

  const handlePostTypeChange = (e) => {
    setPostType(e.target.value);
    setContent(null); // Reset content when post type changes
  };

  const handleFileChange = (e) => {
    setContent(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const db = getDatabase(app);
    const storage = getStorage(app);
    const postId = uuidv4();
    const userId = user?.uid; // Replace with the actual logged-in user ID
    let contentUrl = content;

    if (postType !== "text" && content) {
      const storageReference = storageRef(
        storage,
        `posts/${postType}/${postId}`
      );
      await uploadBytes(storageReference, content);
      contentUrl = await getDownloadURL(storageReference);
    }

    const postRef = ref(db, `posts/${postType}/` + postId);
    await set(postRef, {
      userId,
      content: postType === "text" ? content : contentUrl,
      type: postType,
      description,
      timestamp: Date.now(),
      userName: user?.displayName, // Ajout du nom d'utilisateur
      userProfilePhoto: user?.photoURL, // Ajout de la photo de profil de l'utilisateur
      stickers: {
        thumbsUp: { count: 0 },
        heart: { count: 0 },
        smile: { count: 0 },
        sad: { count: 0 },
      },
    });
    setDescription("");
    alert("Post created successfully!");
    navigate("/Home"); // Redirect to the Read page or wherever appropriate
  };

  return (
    <div className=" w-full flex flex-col items-center justify-center bg-blue-500 py-8">
      <section className="bg-slate-900 flex flex-col items-center justify-center space-y-6 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-center text-2xl font-bold text-white mb-4">
          Create a Post
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="w-full">
            <label htmlFor="postType" className="block text-white mb-2">
              Post Type
            </label>
            <select
              id="postType"
              value={postType}
              onChange={handlePostTypeChange}
              className="w-full px-4 py-2 rounded border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
          </div>

          {postType !== "text" && (
            <div className="w-full">
              <label htmlFor="fileUpload" className="block text-white mb-2">
                Upload File
              </label>
              <input
                id="fileUpload"
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-2 rounded border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div className="w-full">
            <label htmlFor="description" className="block text-white mb-2">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter a description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="4"
              required
            />
          </div>

          <div className="w-full text-center">
            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
            >
              Post
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreatePost;
