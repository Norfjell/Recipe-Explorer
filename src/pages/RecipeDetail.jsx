import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaListUl, FaUtensils, FaGlobe, FaStar } from "react-icons/fa";

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
    <div className="max-w-4xl mx-auto px-4 py-6 font-serif text-gray-800">
      <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white bg-teal-400 hover:bg-teal-500 transition px-4 py-2 rounded mb-6"
        >
          <FaArrowLeft /> Back to Search
        </Link>

        <h1 className="text-3xl font-bold mb-2 text-center">{meal.strMeal}</h1>
        <p className="text-center text-gray-600 mb-4 italic">
          A delicious recipe from <strong>{meal.strArea}</strong> cuisine!
        </p>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="rounded-lg w-full md:w-1/2 object-cover border border-gray-200"
          />

          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <FaListUl className="text-yellow-500" />
              Ingredients
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {ingredients.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <div className="flex gap-4 mt-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <FaUtensils className="text-green-500" />
                <strong>Category:</strong> {meal.strCategory}
              </span>
              <span className="flex items-center gap-2">
                <FaGlobe className="text-blue-400" />
                <strong>Area:</strong> {meal.strArea}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          <div className="bg-gray-50 border border-gray-200 p-4 rounded text-sm leading-relaxed whitespace-pre-line">
            {meal.strInstructions}
          </div>
        </div>

        <div className="bg-white border border-teal-300 rounded p-4 mt-6 flex items-start gap-2">
          <FaStar className="text-teal-400 mt-1" />
          <div>
            <h3 className="font-semibold text-teal-600">Tip</h3>
            <p className="text-sm text-gray-700">
              Want to save this recipe for later? Bookmark it or try customizing it to your taste!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}