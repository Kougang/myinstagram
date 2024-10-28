const admin = require("firebase-admin");

const serviceAccount = require("./SDKAdmin/myinstagramdb-59f53-firebase-adminsdk-vknv4-cba6809e27.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function printFirestoreSchema(collectionPath = "posts") {
  const colRef = db.collection(collectionPath || "/");
  const snapshot = await colRef.get();

  snapshot.forEach((doc) => {
    console.log(`Document ID: ${doc.id}`);
    console.log("Fields:", doc.data());

    // Récursion sur les sous-collections
    doc.ref.listCollections().then((subCollections) => {
      subCollections.forEach((subCol) => {
        console.log(`Sub-collection: ${subCol.id}`);
        printFirestoreSchema(`${collectionPath}/${doc.id}/${subCol.id}`);
      });
    });
  });
}

async function listRootCollections() {
  const collections = await db.listCollections();
  collections.forEach((collection) => {
    console.log(`Root Collection: ${collection.id}`);
    printFirestoreSchema(collection.id);
  });
}

listRootCollections();
