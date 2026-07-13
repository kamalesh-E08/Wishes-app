import { Link } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { useWishStore } from "../../store/wishesStore";
import { useAuthStore } from "../../store/authStore";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { resetWish } = useWishStore();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 bg-black/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-400" />
          <h1 className="font-bold text-xl">Wishes AI</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/">Home</Link>

          {user ? (
            <>
              <Link onClick={resetWish} to="/create">
                Create
              </Link>

              <Link to="/history">History</Link>
              <Link to="/events" className="hover:text-purple-400 transition">
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

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-md bg-white/5"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div className={`md:hidden ${open ? "block" : "hidden"} px-6 pb-4`}>
        <div className="flex flex-col gap-3 bg-black/50 rounded-md p-4">
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>

          {user ? (
            <>
              <Link
                onClick={() => {
                  resetWish();
                  setOpen(false);
                }}
                to="/create"
              >
                Create
              </Link>

              <Link onClick={() => setOpen(false)} to="/history">
                History
              </Link>

              <Link onClick={() => setOpen(false)} to="/events">
                Automations
              </Link>

              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="text-red-400 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link onClick={() => setOpen(false)} to="/login">
                Login
              </Link>

              <Link onClick={() => setOpen(false)} to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
