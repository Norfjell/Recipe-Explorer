import { useState, useEffect } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchRecipes = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const data = await res.json();
      setRecipes(data.meals || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchRecipes();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Recipe Explorer</h1>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for recipes..."
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="px-4 bg-green-600 text-white rounded hover:bg-green-700">
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}

      <div className="grid md:grid-cols-3 gap-4">
        {recipes.map((meal) => (
          <div key={meal.idMeal} className="bg-white p-4 rounded shadow">
            <img src={meal.strMealThumb} alt={meal.strMeal} className="rounded mb-2" />
            <h2 className="text-lg font-semibold">{meal.strMeal}</h2>
            <p className="text-sm text-gray-500">{meal.strArea} - {meal.strCategory}</p>
          </div>
        ))}
      </div>
    </div>
  );
}