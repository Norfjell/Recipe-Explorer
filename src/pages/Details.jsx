import { useParams } from "react-router-dom";

export default function Details() {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-xl font-semibold">Recipe Details for ID: {id}</h1>
    </div>
  );
}