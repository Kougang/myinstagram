import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children, user }) {
  // 2
  const Navigate = useNavigate();
  return user ? children : <Navigate to="/"></Navigate>;
}
