import React, { useEffect, useState } from "react";
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
  const [hasLiked, setHasLiked] = useState(false);

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
    const userId = userID; // Supposons que l'ID de l'utilisateur est stocké dans user

    if (!userId || hasLiked) return; // S'assurer que l'utilisateur est connecté

    const db = getDatabase();
    const stickerUserRef = ref(
      db,
      `posts/${postType}/${postId}/stickers/${stickerType}/users/${userId}`
    );

    // Vérifier si l'utilisateur a déjà liké ce sticker
    onValue(
      stickerUserRef,
      (snapshot) => {
        if (snapshot.exists()) {
          // L'utilisateur a déjà liké, ne rien faire
          console.log("User has already liked this sticker.");
        } else {
          // Incrémenter le nombre de likes dans Firebase et localement
          const currentCount =
            (stickers[postId]?.[stickerType]?.count || 0) + 1;
          const updates = {
            count: currentCount,
          };

          updates[`users/${userId}`] = true; // Ajouter l'utilisateur à la liste des utilisateurs qui ont liké

          // Mettre à jour le nombre de likes et l'utilisateur dans la base de données
          update(
            ref(db, `posts/${postType}/${postId}/stickers/${stickerType}`),
            updates
          );

          setStickers((prevStickers) => {
            const updatedStickers = {
              ...prevStickers,
              [postId]: {
                ...prevStickers[postId],
                [stickerType]: {
                  count: currentCount,
                  users: {
                    ...prevStickers[postId]?.[stickerType]?.users,
                    [userId]: true,
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

            return updatedStickers;
          });
          setHasLiked(true);
        }
      },
      { onlyOnce: true }
    );
  };
  // disabled={hasLiked}
  return (
    <ul className="flex space-x-2">
      <li>
        <button onClick={() => handleStickerLike("thumbsUp")}>
          <span className="bg-gray-500">👍</span>
          {stickers[postId]?.thumbsUp?.count || 0}
        </button>
      </li>
      <li>
        <button onClick={() => handleStickerLike("heart")}>
          <span className="bg-gray-500">❤️</span>
          {stickers[postId]?.heart?.count || 0}
        </button>
      </li>
      <li>
        <button onClick={() => handleStickerLike("smile")}>
          <span className="bg-gray-500">😊</span>
          {stickers[postId]?.smile?.count || 0}
        </button>
      </li>
      <li>
        <button onClick={() => handleStickerLike("sad")}>
          <span className="bg-gray-500">😢</span>
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
