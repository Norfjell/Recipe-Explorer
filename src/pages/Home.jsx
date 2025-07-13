import RecipeSearch from "../components/RecipeSearch";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Recipe Explorer</h1>
      <RecipeSearch />
    </div>
  );
}