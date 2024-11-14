import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  get,
  onValue,
} from "firebase/database";
import app from "./../../firebase/firebaseConfig";
import { v4 as uuidv4 } from "uuid";

import FollowButton from "./FollowButton";

function UserSearch({ user }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followStatus, setFollowStatus] = useState({}); // Objet pour stocker le statut de suivi de chaque utilisateur

  const handleSearch = async () => {
    if (searchTerm.trim() === "") return;
    setLoading(true);
    const db = getDatabase(app);

    const userRef = query(
      ref(db, "users"),
      orderByChild("displayName"),
      equalTo(searchTerm)
    );

    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const results = [];
        snapshot.forEach((childSnapshot) => {
          const userData = { id: childSnapshot.key, ...childSnapshot.val() };
          results.push(userData);
          checkFollowStatus(userData.id); // Vérifie le statut de suivi pour chaque utilisateur trouvé
        });
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
    setLoading(false);
  };

  const currentUserId = user?.uid;

  const checkFollowStatus = (targetUserId) => {
    console.log("currentUserId", currentUserId);

    const db = getDatabase(app);
    const followRef = ref(db, `followers/${currentUserId}/${targetUserId}`);

    // Vérifie en temps réel si l'utilisateur courant suit l'utilisateur cible
    onValue(followRef, (snapshot) => {
      setFollowStatus((prevStatus) => ({
        ...prevStatus,
        [targetUserId]: snapshot.exists(),
      }));
    });
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg space-y-2 w-full max-w-md">
      <h2 className="text-lg font-semibold text-white">Search Users</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter username"
        className="w-full p-2 rounded border border-gray-300 focus:outline-none"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded mt-2"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {searchResults.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {searchResults.map((user) => (
            <li key={user.id} className="flex justify-between items-center">
              <span className="cursor-pointer text-blue-400 hover:underline">
                {user.displayName}
              </span>
              <FollowButton
                currentUserId={currentUserId}
                targetUserId={user.id}
                initialIsFollowing={followStatus[user.id] || false} // Passe l'état initial de suivi
              />
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p className="text-gray-300 mt-4">No users found.</p>
      )}
    </div>
  );
}

export default UserSearch;
