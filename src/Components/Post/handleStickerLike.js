import React, { useEffect } from "react";
import { getDatabase, ref, update, onValue } from "firebase/database";

function HandleStickerLike({ postId, postType, stickers, setStickers }) {
  useEffect(() => {
    const db = getDatabase();
    const stickerRef = ref(db, `posts/${postType}/${postId}/stickers`);

    // Récupérer les stickers depuis Firebase au chargement du composant
    onValue(stickerRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setStickers((prevStickers) => ({
          ...prevStickers,
          [postId]: data,
        }));
      }
    });
  }, [postId, postType, setStickers]);

  const handleStickerLike = (stickerType) => {
    const db = getDatabase();
    const stickerRef = ref(
      db,
      `posts/${postType}/${postId}/stickers/${stickerType}`
    );

    // Incrémenter le nombre de likes dans Firebase et localement
    const currentCount = (stickers[postId]?.[stickerType]?.count || 0) + 1;
    update(stickerRef, {
      count: currentCount,
    });

    setStickers((prevStickers) => ({
      ...prevStickers,
      [postId]: {
        ...prevStickers[postId],
        [stickerType]: { count: currentCount },
      },
    }));
  };

  return (
    <ul className="flex space-x-2">
      <li>
        <button onClick={() => handleStickerLike("thumbsUp")}>
          <span>👍</span>
          {stickers[postId]?.thumbsUp?.count || 0}
        </button>
      </li>
      <li>
        <button onClick={() => handleStickerLike("heart")}>
          <span>❤️</span>
          {stickers[postId]?.heart?.count || 0}
        </button>
      </li>
      <li>
        <button onClick={() => handleStickerLike("smile")}>
          <span>😊</span>
          {stickers[postId]?.smile?.count || 0}
        </button>
      </li>
      <li>
        <button onClick={() => handleStickerLike("sad")}>
          <span>😢</span>
          {stickers[postId]?.sad?.count || 0}
        </button>
      </li>
    </ul>
  );
}

export default HandleStickerLike;
