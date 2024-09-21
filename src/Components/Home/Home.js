import { useState, useEffect } from "react";
import { auth } from "./../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

import CreatePost from "../Post/CreatePost";
import ReadPost from "../Post/ReadPost";
import Header from "./Header";
import Footer from "./Footer";
import "../Style/index.css";

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        return;
      }
      setUser(null);
    });
    return () => unsubscribe();
  }, []);
  return (
    // px-6 py-3 text-white rounded hover:bg-blue-700
    <div className="flex items-center justify-center  bg-gray-800">
      <section className="  bg-slate-900 flex flex-col w-full md:w-2/5 items-center justify-center space-y-4">
        <Header user={user} />
        <CreatePost user={user} />
        <ReadPost />
        <Footer />
      </section>
    </div>
  );
}

export default Home;
