// src/components/Navbar.jsx
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthed, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const dashHref = isAdmin ? "/admin" : "/patient";

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500" />
          <span className="font-semibold">Clinic</span>
        </Link>

        <nav className="flex items-center gap-2">
          {isAuthed && (
            <Link to={dashHref} className="btn-ghost">
              My Dashboard
            </Link>
          )}

          {isAuthed ? (
            <button onClick={onLogout} className="btn-ghost">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
