import { Navigate } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";

function LockOut() {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Deconnexion");
        return <Navigate to="/" />;
      })
      .catch((error) => console.error(error));
  };

  return (
    <section className="flex items-center justify-center ">
      <div>
        <button
          onClick={handleSignOut}
          className="bg-slate-900 px-6 py-3 text-white rounded hover:bg-blue-700"
        >
          Sign Out
        </button>
      </div>
    </section>
  );
}

export default LockOut;
