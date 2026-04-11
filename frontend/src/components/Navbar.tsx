import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Mock API Generator
        </Link>
        <div className="space-x-4">
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link to="/signup" className="hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
