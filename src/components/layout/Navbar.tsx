import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useWishStore } from "../../store/wishesStore";
import { useAuthStore } from "../../store/authStore";
const Navbar = () => {
  const { user, logout } = useAuthStore();
  const {resetWish} = useWishStore();
  return (
    <nav
      className="
      sticky
      top-0
      z-50
      backdrop-blur-xl
      border-b
      border-white/10
      bg-black/30
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-400" />
          <h1 className="font-bold text-xl">Wishes AI</h1>
        </div>

        {/* Navigation */}
        <div className="flex gap-8 items-center">
          <Link to="/">Home</Link>

          {user ? (
            <>
              <Link onClick={resetWish} to="/create">
                Create
              </Link>

              <Link to="/history">History</Link>
              <Link
                to="/events"
                className="
                    hover:text-purple-400
                    transition
                  "
              >
                Automations
              </Link>

              <button onClick={logout} className="text-red-400">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>

              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
