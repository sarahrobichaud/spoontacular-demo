import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLayout } from "../contexts/LayoutContext";
import { useAnimationPrefs } from "../contexts/AnimationContext";
import { useRecipeDetails } from "../hooks/use-recipe-details";
import { CustomLoader } from "../components/ui/CustomLoader";

export default function RecipeDetails() {
  const { id } = useParams();
  const { layoutState, setLayoutState } = useLayout();
  const { prefersReducedMotion } = useAnimationPrefs();
  const { recipe, loading, error } = useRecipeDetails(id);

  useEffect(() => {
    if (layoutState === 'centered') {
      setLayoutState('header');
    }

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  }, [layoutState, setLayoutState, prefersReducedMotion]);

  if (loading) {
    return <CustomLoader />;
  }

  if (error || !recipe) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">
          {error ? `Error loading recipe: ${error}` : 'Recipe not found'}
        </h2>
        <Link to="/" className="text-blue-500 hover:underline">Return to search</Link>
      </div>
    );
  }

  const healthLabels = [
    ...(recipe.diets || []),
    ...[
      recipe.vegetarian ? 'Vegetarian' : null,
      recipe.vegan ? 'Vegan' : null,
      recipe.glutenFree ? 'Gluten-Free' : null,
      recipe.dairyFree ? 'Dairy-Free' : null
    ].filter(Boolean)
  ];

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={prefersReducedMotion ? {} : { opacity: 1 }}
      exit={prefersReducedMotion ? {} : { opacity: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <Link to="/" className="text-blue-500 hover:underline inline-flex items-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to search
      </Link>

      <div className="bg-black/10 border-2 border-gray-300/10 rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-80 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h1 className="text-3xl font-bold text-white">{recipe.title}</h1>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              ⏱️ {recipe.readyInMinutes} mins
            </span>
            <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
              ❤️ {recipe.healthScore}% Health Score
            </span>
            <span className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              👥 {recipe.servings} servings
            </span>
          </div>

          {healthLabels.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Health Information</h2>
              <div className="flex flex-wrap gap-2">
                {healthLabels.map((label, index) => {
                  const capitalizedLabel = label
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                  return (
                    <span
                      key={index}
                      className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full"
                    >
                      {capitalizedLabel}
                  </span>
                )})}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Summary</h2>
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: recipe.summary }}
            />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recipe.extendedIngredients.map((ingredient) => {

                  const capitalizedName = ingredient.name
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                  return (
                  <li key={ingredient.id} className="flex items-start">
                    <img
                      src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
                      alt={capitalizedName}
                      className="w-10 h-10 object-cover rounded mr-3 mt-1"
                    />
                    <div>
                      <span className="font-medium">{capitalizedName}</span>
                      <span className="text-gray-600 block">
                        {ingredient.amount} {ingredient.unit}
                      </span>
                    </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>

            {recipe.analyzedInstructions.length > 0 ? (
              <div className="space-y-6">
                {recipe.analyzedInstructions.map((instruction, idx) => (
                  <div key={idx}>
                    {instruction.name && (
                      <h3 className="font-medium text-lg mb-2">{instruction.name}</h3>
                    )}
                    <ol className="space-y-4">
                      {instruction.steps.map((step) => {
                        return (
                          <li key={step.number} className="ml-6 list-decimal">
                            <div className="font-medium mb-1">Step {step.number}</div>
                            <p className="text-gray-700">{step.step}</p>

                            {(step.ingredients.length > 0 || step.equipment.length > 0) && (
                              <div className="mt-2 flex flex-wrap gap-4">
                                {step.ingredients.length > 0 && (
                                  <div className="flex items-center">
                                    <span className="text-sm text-gray-500 mr-2">Ingredients:</span>
                                    <div className="flex flex-wrap gap-1">
                                      {step.ingredients.map((ing, i) => (
                                        <span key={i} className="text-sm bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                          {ing.name}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {step.equipment.length > 0 && (
                                  <div className="flex items-center">
                                    <span className="text-sm text-gray-500 mr-2">Equipment:</span>
                                    <div className="flex flex-wrap gap-1">
                                      {step.equipment.map((eq, i) => (
                                        <span key={i} className="text-sm bg-gray-50 text-gray-700 px-2 py-0.5 rounded">
                                          {eq.name}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-700 whitespace-pre-line">{recipe.instructions || "No instructions available."}</p>
            )}
          </div>

          {recipe.sourceUrl && (
            <div className="mt-8 pt-4 border-t border-gray-200">
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline inline-flex items-center"
              >
                <span>View original recipe</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}