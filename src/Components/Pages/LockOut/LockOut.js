import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";

function LockOut() {
  // 1
  const Navigate = useNavigate();
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Deconnexion");
        Navigate("/");
      })
      .catch((error) => console.error(error));
  };

  return (
    <section className="flex items-center justify-center ">
      <div>
        <button
          onClick={handleSignOut}
          className="bg-red-900 px-6 py-3 text-white rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    </section>
  );
}

export default LockOut;
