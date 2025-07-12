import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-orange-100 shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-orange-600 tracking-wide">
        🍽️ Recipe Explorer
      </Link>
      <nav className="space-x-4 text-sm font-medium text-gray-700">
        <Link to="/" className="hover:text-orange-500">Home</Link>
        <Link to="/favorites" className="hover:text-orange-500">Favorites</Link>
      </nav>
    </header>
  );
}