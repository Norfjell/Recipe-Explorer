import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RecipeSearch() {
    const [query, setQuery] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState("");
    const [sortOption, setSortOption] = useState("name-asc");

    // Fetch areas (regions)
    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
                const data = await res.json();
                setAreas(data.meals.map((a) => a.strArea));
            } catch (err) {
                console.error("Error fetching areas:", err);
            }
        };
        fetchAreas();
    }, []);

    const searchRecipes = async () => {
        if (!query) return;
        setLoading(true);
        setErrorMsg("");
        setRecipes([]);

        try {
            const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            const data = await res.json();
            let meals = data.meals || [];

            // Filter by area
            if (selectedArea) {
                meals = meals.filter((meal) => meal.strArea === selectedArea);
            }

            // Simulate prep time based on id
            meals = meals.map((meal) => ({
                ...meal,
                prepTime: parseInt(meal.idMeal.slice(-2)) + 10, // Fake prep time between 10-99 min
            }));

            // Apply sorting
            meals.sort((a, b) => {
                if (sortOption === "name-asc") {
                    return a.strMeal.localeCompare(b.strMeal);
                } else if (sortOption === "name-desc") {
                    return b.strMeal.localeCompare(a.strMeal);
                } else if (sortOption === "prep-asc") {
                    return a.prepTime - b.prepTime;
                } else if (sortOption === "prep-desc") {
                    return b.prepTime - a.prepTime;
                }
                return 0;
            });

            if (meals.length > 0) {
                setRecipes(meals);
            } else {
                setErrorMsg("No recipes found.");
            }
        } catch (err) {
            console.error("Search error:", err);
            setErrorMsg("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        searchRecipes();
    };

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="mb-8 bg-white border border-teal-200 rounded-lg shadow p-6 space-y-4"
            >
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                    🔍 Search Recipes
                </h2>

                <div className="grid md:grid-cols-4 gap-4">
                    {/* Query Input */}
                    <div className="relative col-span-2">
                        <label className="text-sm font-medium text-gray-600 block mb-1">Recipe Name</label>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g. Chicken Alfredo"
                            className="w-full p-2 pl-10 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                        />
                    </div>

                    {/* Area Filter */}
                    <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">🌍 Area</label>
                        <select
                            value={selectedArea}
                            onChange={(e) => setSelectedArea(e.target.value)}
                            className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                        >
                            <option value="">All Areas</option>
                            {areas.map((area) => (
                                <option key={area} value={area}>
                                    {area}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Filter */}
                    <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">📊 Sort By</label>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300"
                        >
                            <option value="name-asc">Name: A → Z</option>
                            <option value="name-desc">Name: Z → A</option>
                            <option value="prep-asc">Prep: Low → High</option>
                            <option value="prep-desc">Prep: High → Low</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-4 bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 py-2 rounded transition"
                >
                    Search
                </button>
            </form>

            {loading && <p className="text-center text-gray-500">Loading...</p>}
            {errorMsg && !loading && <p className="text-center text-red-500">{errorMsg}</p>}

            {!loading && recipes.length > 0 && (
                <div className="grid md:grid-cols-3 gap-4">
                    {recipes.map((meal) => (
                        <Link to={`/recipe/${meal.idMeal}`} key={meal.idMeal}>
                            <div className="bg-white rounded shadow hover:shadow-md transition h-full flex flex-col">
                                <img
                                    src={meal.strMealThumb}
                                    alt={meal.strMeal}
                                    className="rounded-t w-full h-48 object-cover"
                                />
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 mb-1">{meal.strMeal}</h2>
                                        <p className="text-sm text-gray-500">{meal.strArea} - {meal.strCategory}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}