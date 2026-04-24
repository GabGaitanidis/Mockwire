import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem("user")));
  }, [location.pathname]);

  return (
    <nav className="border-b border-[#30363d] bg-[#111318]">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-[#e6edf3]"
        >
          Mockwire
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <Link
            to="/"
            className="text-[#8b949e] transition hover:text-[#58a6ff]"
          >
            Dashboard
          </Link>

          {isAuthenticated ? (
            <button
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("apiKey");
                setIsAuthenticated(false);
                navigate("/login");
              }}
              className="rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-1.5 text-[#8b949e] transition hover:border-[#58a6ff] hover:text-[#e6edf3]"
            >
              Logout
            </button>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
