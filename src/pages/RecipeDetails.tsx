import { useParams } from "react-router";

export default function RecipeDetails() {
  const { id } = useParams();
  return <div>RecipeDetails {id}</div>;
}
