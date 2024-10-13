import React, { useEffect, useState } from "react";
import { getDatabase, ref, update, onValue } from "firebase/database";

function HandleStickerLike({
  postId,
  postType,
  stickers,
  setStickers,
  onTotalChange,
}) {
  const [totalLikesTemp, settotalLikesTemp] = useState(0);
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

        // Calculer la somme totale des likes des stickers
        const totalLikes = Object.values(data || {}).reduce(
          (sum, sticker) => sum + (sticker.count || 0),
          0
        );

        // Appeler la fonction de rappel pour informer le composant parent
        onTotalChange(totalLikes);
        settotalLikesTemp(totalLikes);
      }
    });
  }, [postId, postType, setStickers]);

  const handleStickerLike = (stickerType) => {
    // handleLike(postType, postId);
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

    setStickers((prevStickers) => {
      const updatedStickers = {
        ...prevStickers,
        [postId]: {
          ...prevStickers[postId],
          [stickerType]: { count: currentCount },
        },
      };

      // Calculer la nouvelle somme totale des likes
      const newTotalLikes = Object.values(updatedStickers[postId] || {}).reduce(
        (sum, sticker) => sum + (sticker.count || 0),
        0
      );

      // Appeler la fonction de rappel pour mettre à jour le total
      onTotalChange(newTotalLikes);
      settotalLikesTemp(newTotalLikes);

      return updatedStickers;
    });
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
      <li>
        <span className="border-2 border-blue-500 rounded">
          {totalLikesTemp}
        </span>
      </li>
    </ul>
  );
}

export default HandleStickerLike;
