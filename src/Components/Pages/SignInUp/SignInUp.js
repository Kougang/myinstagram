import { useState } from "react";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { Navigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";

import CheckUsername from "./CheckUsername";

function SignInUp({ user }) {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [name, setName] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

  const handleFormChange = () => {
    setIsSignUpActive(!isSignUpActive);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!email || !password || !name) return;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);

        // Mettre à jour le nom d'utilisateur
        updateProfile(user, { displayName: name })
          .then(() => {
            console.log("User profile updated:", user);

            // Enregistrer la visibilité par défaut du compte comme public dans la base de données
            const db = getDatabase();
            set(ref(db, "users/" + user.uid), {
              displayName: name,
              email: user.email,
              privacy: "public", // Visibilité par défaut du compte (public)
            })
              .then(() => {
                console.log("User privacy set to public by default");
                setLoggedInUser(user);
              })
              .catch((error) => {
                console.error("Error setting user privacy:", error);
              });
          })
          .catch((error) => {
            console.error("Error updating user profile:", error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const handleSignIn = (e) => {
    console.log(email, password);
    e.preventDefault();
    if (!email || !password) return;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setLoggedInUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleNameChange = (event) => setName(event.target.value);

  if (user) {
    return <Navigate to="/Home" />;
  }

  return (
    <section className="flex items-center justify-center">
      <div className="w-full h-screen bg-slate-900 border border-white w-2/5 p-6 flex flex-col items-center">
        <form className="flex flex-col gap-2 bg-slate-50 p-5 rounded shadow-md">
          {isSignUpActive && (
            <h1 className="text-center text-slate-900 text-4xl mb-3">
              Sign Up
            </h1>
          )}
          {!isSignUpActive && (
            <h1 className="text-center text-slate-900 text-4xl mb-3">
              Sign In
            </h1>
          )}

          {isSignUpActive && (
            <>
              <label className="text-slate-900">Name</label>
              <input
                type="text"
                onChange={handleNameChange}
                name="name"
                className="h-10 border border-slate-900 rounded p-4"
              />
              <CheckUsername username={name} onCheck={setIsUsernameAvailable} />
            </>
          )}

          {!isSignUpActive && (
            <>
              <label className="text-slate-900">Name</label>
              <input
                type="text"
                onChange={handleNameChange}
                name="name"
                className="h-10 border border-slate-900 rounded p-4"
              />
            </>
          )}

          <label className="text-slate-900">Email</label>
          <input
            type="email"
            onChange={handleEmailChange}
            name="email"
            className="h-10 border border-slate-900 rounded p-4"
          />

          <label className="text-slate-900">Password</label>
          <input
            type="password"
            onChange={handlePasswordChange}
            name="password"
            className="h-10 border border-slate-900 rounded p-4"
          />

          {isSignUpActive && (
            <button
              onClick={handleSignUp}
              type="submit"
              className="bg-slate-900 px-3 py-1.5 text-white my-3 rounded hover:bg-blue-700"
              disabled={!isUsernameAvailable} // Désactiver le bouton si le nom d'utilisateur n'est pas disponible
            >
              Sign Up
            </button>
          )}
          {!isSignUpActive && (
            <button
              onClick={handleSignIn}
              type="submit"
              className="bg-slate-900 px-3 py-1.5 text-white my-3  rounded hover:bg-blue-700"
            >
              Sign In
            </button>
          )}

          {isSignUpActive && (
            <a
              onClick={handleFormChange}
              href="#"
              className="text-red-500 hover:text-red-900"
            >
              Login
            </a>
          )}
          {!isSignUpActive && (
            <a
              onClick={handleFormChange}
              href="#"
              className="text-red-500 hover:text-red-900"
            >
              Create an account
            </a>
          )}
        </form>
      </div>
    </section>
  );
}

export default SignInUp;
