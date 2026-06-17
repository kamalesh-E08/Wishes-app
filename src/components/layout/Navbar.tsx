import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Navbar = () => {
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
          <Link to="/" className="hover:text-purple-400 transition">
            Home
          </Link>

          <Link to="/create" className="hover:text-purple-400 transition">
            Create
          </Link>

          <Link to="/history" className="hover:text-purple-400 transition">
            History
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
