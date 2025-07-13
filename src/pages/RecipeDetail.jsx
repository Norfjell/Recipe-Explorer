import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaListUl, FaUtensils, FaGlobe } from "react-icons/fa";

export default function RecipeDetail() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeal() {
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        setMeal(data.meals?.[0] || null);
      } catch (err) {
        console.error("Failed to fetch recipe:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMeal();
  }, [id]);

  if (loading) return <p className="text-center p-4 text-gray-500">Loading recipe...</p>;
  if (!meal) return <p className="text-center p-4 text-red-600">Recipe not found.</p>;

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${ingredient} - ${measure}`);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-6"
      >
        <FaArrowLeft /> Back to Search
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">{meal.strMeal}</h1>

      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        className="w-full max-h-[400px] object-cover rounded-lg shadow mb-6"
      />

      <div className="flex items-center text-sm text-gray-600 mb-6 gap-6">
        <span className="flex items-center gap-2">
          <FaUtensils className="text-green-600" />
          <strong>Category:</strong> {meal.strCategory}
        </span>
        <span className="flex items-center gap-2">
          <FaGlobe className="text-blue-500" />
          <strong>Area:</strong> {meal.strArea}
        </span>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
          <FaListUl className="text-yellow-600" />
          Ingredients
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {ingredients.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Instructions</h2>
        <div className="bg-gray-50 border border-gray-200 p-4 rounded text-gray-700 leading-relaxed whitespace-pre-line">
          {meal.strInstructions}
        </div>
      </div>
    </div>
  );
}