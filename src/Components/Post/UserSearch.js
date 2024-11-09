import React, { useState } from "react";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  get,
} from "firebase/database";
import app from "./../../firebase/firebaseConfig";

function UserSearch({ onUserSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const db = getDatabase(app);
    const userRef = query(
      ref(db, "users"),
      orderByChild("userName"),
      equalTo(searchTerm)
    );

    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const results = [];
        snapshot.forEach((childSnapshot) => {
          results.push({ id: childSnapshot.key, ...childSnapshot.val() });
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
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {searchResults.length > 0 ? (
        <ul className="mt-4">
          {searchResults.map((user) => (
            <li
              key={user.id}
              onClick={() => onUserSelect(user)}
              className="cursor-pointer text-blue-400 hover:underline"
            >
              {user.userName}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-300 mt-4">No users found.</p>
      )}
    </div>
  );
}

export default UserSearch;
