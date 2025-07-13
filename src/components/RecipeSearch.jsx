import { useEffect, useState } from "react";

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
            <form onSubmit={handleSubmit} className="mb-6 grid md:grid-cols-4 gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for recipes..."
                    className="p-2 border rounded col-span-2"
                />

                <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">All Areas</option>
                    {areas.map((area) => (
                        <option key={area} value={area}>{area}</option>
                    ))}
                </select>

                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="name-asc">Name: A → Z</option>
                    <option value="name-desc">Name: Z → A</option>
                    <option value="prep-asc">Prep Time: Low → High</option>
                    <option value="prep-desc">Prep Time: High → Low</option>
                </select>

                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 col-span-full md:col-auto"
                >
                    Search
                </button>
            </form>

            {loading && <p className="text-center text-gray-500">Loading...</p>}
            {errorMsg && !loading && <p className="text-center text-red-500">{errorMsg}</p>}

            {!loading && recipes.length > 0 && (
                <div className="grid md:grid-cols-3 gap-4">
                    {recipes.map((meal) => (
                        <div key={meal.idMeal} className="bg-white p-4 rounded shadow">
                            <img src={meal.strMealThumb} alt={meal.strMeal} className="rounded mb-2" />
                            <h2 className="text-lg font-semibold">{meal.strMeal}</h2>
                            <p className="text-sm text-gray-500">
                                {meal.strArea} – Prep time: {meal.prepTime} min
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}