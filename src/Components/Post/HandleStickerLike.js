import React, { useEffect, useState } from "react";
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
  const [likedSticker, setLikedSticker] = useState(null); // Le sticker actuellement liké

  useEffect(() => {
    const db = getDatabase(app);
    const stickerRef = ref(db, `posts/${postType}/${postId}/stickers`);

    // Récupérer les stickers depuis Firebase au chargement du composant
    onValue(stickerRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setStickers((prevStickers) => ({
          ...prevStickers,
          [postId]: data,
        }));

        // Calculer la somme totale des likes des stickers
        const totalLikes = Object.values(data || {}).reduce(
          (sum, sticker) => sum + (sticker.count || 0),
          0
        );

        onTotalChange(totalLikes);
        settotalLikesTemp(totalLikes);
      }
    });
  }, [postId, postType, setStickers, onTotalChange]);

  const handleStickerLike = (stickerType) => {
    const userId = userID;
    if (!userId) return; // S'assurer que l'utilisateur est connecté

    const db = getDatabase(app);
    const stickerRef = ref(
      db,
      `posts/${postType}/${postId}/stickers/${stickerType}`
    );
    const stickerUserRef = ref(
      db,
      `posts/${postType}/${postId}/stickers/${stickerType}/users/${userId}`
    );

    // Vérifier si l'utilisateur a déjà liké ce sticker
    onValue(
      stickerUserRef,
      (snapshot) => {
        const alreadyLiked = snapshot.exists();
        const currentCount = stickers[postId]?.[stickerType]?.count || 0;

        // Si l'utilisateur clique à nouveau, on décrémente, sinon on incrémente
        const newCount = alreadyLiked ? currentCount - 1 : currentCount + 1;

        // Mettre à jour le compteur et verrouiller les autres stickers
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

          // Calculer la nouvelle somme totale des likes
          const newTotalLikes = Object.values(
            updatedStickers[postId] || {}
          ).reduce((sum, sticker) => sum + (sticker.count || 0), 0);

          onTotalChange(newTotalLikes);
          settotalLikesTemp(newTotalLikes);

          // Mettre à jour le sticker actuellement liké ou l'enlever si le like est retiré
          setLikedSticker(alreadyLiked ? null : stickerType);

          return updatedStickers;
        });
      },
      { onlyOnce: true }
    );
  };

  return (
    <div>
      <button
        onClick={() => handleStickerLike("thumbsUp")}
        disabled={likedSticker && likedSticker !== "thumbsUp"}
      >
        👍 {stickers[postId]?.thumbsUp?.count || 0}
      </button>

      <button
        onClick={() => handleStickerLike("heart")}
        disabled={likedSticker && likedSticker !== "heart"}
      >
        ❤️ {stickers[postId]?.heart?.count || 0}
      </button>

      <button
        onClick={() => handleStickerLike("smile")}
        disabled={likedSticker && likedSticker !== "smile"}
      >
        😊 {stickers[postId]?.smile?.count || 0}
      </button>

      <button
        onClick={() => handleStickerLike("sad")}
        disabled={likedSticker && likedSticker !== "sad"}
      >
        😢 {stickers[postId]?.sad?.count || 0}
      </button>
      <span className="border-2 border-blue-500 rounded">{totalLikesTemp}</span>
    </div>
  );
}

export default HandleStickerLike;
