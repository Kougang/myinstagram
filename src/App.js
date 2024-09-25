import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import app from "./firebase/firebaseConfig";

import SignInUp from "./Components/Pages/SignInUp/SignInUp";
import Home from "./Components/Home/Home";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import ProtectedRoute from "./Components/Pages/Protected/ProtectedRoute";
import { auth } from "./firebase/firebaseConfig";

import CreatePost from "./Components/Post/CreatePost";
import ReadPosts from "./Components/Post/ReadPost";

import UserProfile from "./Components/Pages/UserProfil/UserProfile";
import Main from "./Components/Menu/Main";

import AppLoadScreen from "./Components/LoadingScreen/AppLoadScreen";

function App() {
  const [user, setUser] = useState(null);
  const [isFetch, setIsFetch] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsFetch(false);
        return;
      }
      setUser(null);
      setIsFetch(false);
    });
    return () => unsubscribe();
  }, []);

  if (isFetch) {
    return <AppLoadScreen />;
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<SignInUp user={user} />} />
          <Route
            path="/Home/*"
            element={
              <ProtectedRoute user={user}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Main/*"
            element={
              <ProtectedRoute user={user}>
                <Main />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CreatePost"
            element={
              <ProtectedRoute user={user}>
                <CreatePost user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ReadPost"
            element={
              <ProtectedRoute user={user}>
                <ReadPosts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/UserProfile"
            element={
              <ProtectedRoute user={user}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          {/*..................
          <Route path="/parameter" element={<UserProfile />} />
          <Route
            path="/contact"
            element={
              <ProtectedRoute user={user}>
                <Contact />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/bibliographie" element={<Bibliographie />} />
          <Route path="/lockout" element={<LockOut />} />
          */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
