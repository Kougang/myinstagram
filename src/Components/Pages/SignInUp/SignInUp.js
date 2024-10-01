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
  const [field, setField] = useState(false); // Field validation state
  const [errorMessage, setErrorMessage] = useState("");
  const [badpeErrorMessage, setBadpeErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [badpe, setBadpe] = useState(false); // athentification state

  const handleFormChange = () => {
    setIsSignUpActive(!isSignUpActive);
  };

  const handleEyes = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    if (!email || !password || !name) {
      setErrorMessage("Veuillez remplir tous les champs");
      return;
    }

    setErrorMessage("");
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
    // console.log(email, password);
    e.preventDefault();

    if (!email || !password) {
      setField(true);
      setBadpe(true);
      setErrorMessage("Please complete all fields");
      return;
    }

    setErrorMessage("");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setBadpe(false);
        setBadpeErrorMessage("");
        const user = userCredential.user;
        console.log(user);

        setLoggedInUser(user);
      })
      .catch((error) => {
        setBadpe(true);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        console.log("mauvaise authentification ou echec d authentification");
        setBadpeErrorMessage("Enter corrects informations");
      });
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setBadpeErrorMessage("");
    setErrorMessage("");
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setBadpeErrorMessage("");
    setErrorMessage("");
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
    setBadpeErrorMessage("");
    setErrorMessage("");
  };

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
                required
              />
              <CheckUsername username={name} onCheck={setIsUsernameAvailable} />
            </>
          )}

          <label className="text-slate-900">Email</label>
          <input
            type="email"
            onChange={handleEmailChange}
            name="email"
            className="h-10 border border-slate-900 rounded p-4"
            required
          />

          <label className="text-slate-900">Password</label>
          <div className="xs:flex ">
            <input
              type={showPassword ? "text" : "password"}
              onChange={handlePasswordChange}
              name="password"
              className="h-10 w-auto border border-slate-900 rounded p-4"
              required
            />

            {showPassword ? (
              <span
                role="img"
                aria-label="Hide password"
                onClick={handleEyes}
                className="xs:mt-2"
              >
                👁️
              </span>
            ) : (
              <span
                role="img"
                aria-label="Show password"
                onClick={handleEyes}
                className="xs:mt-2"
              >
                👁️‍🗨️
              </span>
            )}
          </div>

          {field && <p className="text-red-500 text-center">{errorMessage}</p>}

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
            <div className="flex items-center justify-center">
              {!badpe && (
                <button
                  onClick={handleSignIn}
                  type="submit"
                  className="bg-slate-900 px-3 py-1.5 text-white my-3  rounded hover:bg-blue-700"
                >
                  Sign In
                </button>
              )}

              {badpe && (
                <div className="flex  flex-col items-center justify-center">
                  <p className="text-red-500">{badpeErrorMessage}</p>
                  <button
                    onClick={handleSignIn}
                    type="submit"
                    className="bg-slate-900 px-3 py-1.5 text-white my-3  rounded hover:bg-red-700"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
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
