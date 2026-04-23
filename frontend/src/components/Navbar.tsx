import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="border-b border-[#30363d] bg-[#111318]">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-[#e6edf3]"
        >
          Mockwire
        </Link>
        <div className="space-x-5 text-sm">
          <Link
            to="/login"
            className="text-[#8b949e] transition hover:text-[#58a6ff]"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-[#8b949e] transition hover:text-[#58a6ff]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
