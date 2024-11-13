import React, { useEffect, useState, useCallback } from "react";
import app from "./../../firebase/firebaseConfig";
import { getDatabase, ref, update, onValue } from "firebase/database";

function HandleStickerLike({
  postId,
  postType,
  stickers,
  setStickers,
  onTotalChange,
  userID,
}) {
  const [totalLikesTemp, settotalLikesTemp] = useState(0);
  const [likedSticker, setLikedSticker] = useState(null);

  // Fetch stickers only if not already fetched or if postId changes
  useEffect(() => {
    const db = getDatabase(app);
    const stickerRef = ref(db, `posts/${postType}/${postId}/stickers`);

    const listener = onValue(stickerRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setStickers((prevStickers) => {
          if (prevStickers[postId]) {
            // If no change, return the existing state
            if (JSON.stringify(prevStickers[postId]) === JSON.stringify(data)) {
              return prevStickers;
            }
          }
          return {
            ...prevStickers,
            [postId]: data,
          };
        });

        const totalLikes = Object.values(data || {}).reduce(
          (sum, sticker) => sum + (sticker.count || 0),
          0
        );

        onTotalChange(totalLikes);
        settotalLikesTemp(totalLikes);
      }
    });

    return () => {
      // Clean up the listener when component unmounts
      listener();
    };
  }, [postId, postType, setStickers, onTotalChange]);

  const handleStickerLike = useCallback(
    (stickerType) => {
      const userId = userID;
      if (!userId) return; // Ensure the user is logged in

      const db = getDatabase(app);
      const stickerRef = ref(
        db,
        `posts/${postType}/${postId}/stickers/${stickerType}`
      );
      const stickerUserRef = ref(
        db,
        `posts/${postType}/${postId}/stickers/${stickerType}/users/${userId}`
      );

      // Check if the user has already liked this sticker
      onValue(
        stickerUserRef,
        (snapshot) => {
          const alreadyLiked = snapshot.exists();
          const currentCount = stickers[postId]?.[stickerType]?.count || 0;

          const newCount = alreadyLiked ? currentCount - 1 : currentCount + 1;

          const updates = {
            count: newCount,
            [`users/${userId}`]: !alreadyLiked ? true : null,
          };

          update(stickerRef, updates);

          setStickers((prevStickers) => {
            const updatedStickers = {
              ...prevStickers,
              [postId]: {
                ...prevStickers[postId],
                [stickerType]: {
                  count: newCount,
                  users: {
                    ...prevStickers[postId]?.[stickerType]?.users,
                    [userId]: !alreadyLiked ? true : null,
                  },
                },
              },
            };

            const newTotalLikes = Object.values(
              updatedStickers[postId] || {}
            ).reduce((sum, sticker) => sum + (sticker.count || 0), 0);

            onTotalChange(newTotalLikes);
            settotalLikesTemp(newTotalLikes);

            setLikedSticker(alreadyLiked ? null : stickerType);

            return updatedStickers;
          });
        },
        { onlyOnce: true }
      );
    },
    [postId, postType, stickers, userID, setStickers, onTotalChange]
  );

  return (
    <div>
      {["thumbsUp", "heart", "smile", "sad"].map((stickerType) => (
        <button
          key={stickerType}
          onClick={() => handleStickerLike(stickerType)}
          disabled={likedSticker && likedSticker !== stickerType}
        >
          {stickerType === "thumbsUp" && "👍"}
          {stickerType === "heart" && "❤️"}
          {stickerType === "smile" && "😊"}
          {stickerType === "sad" && "😢"}{" "}
          {stickers[postId]?.[stickerType]?.count || 0}
        </button>
      ))}
      <span className="border-2 border-blue-500 rounded">{totalLikesTemp}</span>
    </div>
  );
}

export default HandleStickerLike;
