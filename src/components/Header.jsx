import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white border-b border-teal-200 shadow-sm px-6 py-4 font-serif">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-teal-500 flex items-center gap-2">
          🍽️ <span className="tracking-wide">Recipe Explorer</span>
        </Link>

        <nav className="space-x-6 text-gray-600 text-sm font-medium">
          <Link
            to="/"
            className="hover:text-teal-600 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/favorites"
            className="hover:text-teal-600 transition-colors duration-200"
          >
            Favorites
          </Link>
        </nav>
      </div>
    </header>
  );
}