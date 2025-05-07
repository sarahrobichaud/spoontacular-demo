import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLayout } from "../contexts/LayoutContext";
import { useAnimationPrefs } from "../contexts/AnimationContext";

const mockRecipes = [
  { 
    id: "1", 
    title: "Pasta Carbonara", 
    image: "https://placehold.co/600x400", 
    minutes: 30, 
    healthScore: 45,
    servings: 4,
    summary: "A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.",
    instructions: "Boil pasta. Cook pancetta. Mix eggs and cheese. Combine everything. Add pepper.",
    ingredients: [
      "200g spaghetti", "100g pancetta", "2 large eggs", "50g Pecorino Romano", "50g Parmesan", "Black pepper"
    ]
  },
];

export default function RecipeDetails() {
  const { id } = useParams();
  const { layoutState, setLayoutState } = useLayout();
  const { prefersReducedMotion } = useAnimationPrefs();
  

  useEffect(() => {
    if (layoutState === 'centered') {
      setLayoutState('header');
    }
  }, [layoutState, setLayoutState]);
  
  const recipe = mockRecipes.find(r => r.id === id);
  
  if (!recipe) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Recipe not found</h2>
        <Link to="/" className="text-blue-500 hover:underline">Return to search</Link>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={ prefersReducedMotion ? {} : { opacity: 0 }}
      animate={ prefersReducedMotion ? {} : { opacity: 1 }}
      exit={ prefersReducedMotion ? {} : { opacity: 0 }}
      transition={ prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
      className=""
    >
      <Link to="/" className="text-blue-500 hover:underline inline-flex items-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to search
      </Link>
      
      <div className="bg-black/50 border-2 border-gray-300/10 rounded-lg shadow-lg overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-80 object-cover"
        />
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <span className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              ⏱️ {recipe.minutes} mins
            </span>
            <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
              ❤️ {recipe.healthScore}% Health Score
            </span>
            <span className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              👥 {recipe.servings} servings
            </span>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Summary</h2>
            <p className="text-gray-700">{recipe.summary}</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">•</span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <p className="text-gray-700 whitespace-pre-line">{recipe.instructions}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}