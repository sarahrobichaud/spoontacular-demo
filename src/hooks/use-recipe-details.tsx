import { useState, useEffect } from 'react';
import { getRecipeInformation, type DetailedRecipe } from '../services/spoonacular';

const mockDetailedRecipe: DetailedRecipe = {
  id: 1,
  title: "Pasta Carbonara",
  image: "https://placehold.co/600x400",
  imageType: "jpg",
  servings: 4,
  readyInMinutes: 30,
  healthScore: 45,
  summary: "A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.",
  instructions: "1. Cook pasta in boiling salted water. 2. In a separate pan, cook the pancetta until crispy. 3. In a bowl, mix eggs, grated cheese, and pepper. 4. Drain pasta and immediately mix with egg mixture and pancetta. 5. Serve with extra cheese and black pepper.",
  analyzedInstructions: [
    {
      name: "",
      steps: [
        {
          number: 1,
          step: "Cook pasta in boiling salted water.",
          ingredients: [{ id: 20420, name: "pasta", localizedName: "pasta", image: "pasta.jpg" }],
          equipment: []
        },
        {
          number: 2,
          step: "In a separate pan, cook the pancetta until crispy.",
          ingredients: [{ id: 10410123, name: "pancetta", localizedName: "pancetta", image: "pancetta.jpg" }],
          equipment: [{ id: 20420, name: "pan", localizedName: "pan", image: "pan.jpg" }]
        },
        {
          number: 3,
          step: "In a bowl, mix eggs, grated cheese, and pepper.",
          ingredients: [
            { id: 1123, name: "eggs", localizedName: "eggs", image: "eggs.jpg" },
            { id: 1041009, name: "cheese", localizedName: "cheese", image: "cheese.jpg" },
            { id: 1002030, name: "pepper", localizedName: "pepper", image: "pepper.jpg" }
          ],
          equipment: [{ id: 404783, name: "bowl", localizedName: "bowl", image: "bowl.jpg" }]
        },
        {
          number: 4,
          step: "Drain pasta and immediately mix with egg mixture and pancetta.",
          ingredients: [
            { id: 20420, name: "pasta", localizedName: "pasta", image: "pasta.jpg" },
            { id: 10410123, name: "pancetta", localizedName: "pancetta", image: "pancetta.jpg" },
            { id: 1123, name: "egg", localizedName: "egg", image: "egg.png" }
          ],
          equipment: []
        },
        {
          number: 5,
          step: "Serve with extra cheese and black pepper.",
          ingredients: [
            { id: 1041009, name: "cheese", localizedName: "cheese", image: "cheese.jpg" },
            { id: 1002030, name: "black pepper", localizedName: "black pepper", image: "black-pepper.jpg" }
          ],
          equipment: []
        }
      ]
    }
  ],
  extendedIngredients: [
    { id: 20420, aisle: "Pasta and Rice", image: "pasta.jpg", name: "spaghetti", amount: 200, unit: "g", unitShort: "g", unitLong: "grams", originalString: "200g spaghetti", metaInformation: [] },
    { id: 10410123, aisle: "Meat", image: "pancetta.jpg", name: "pancetta", amount: 100, unit: "g", unitShort: "g", unitLong: "grams", originalString: "100g pancetta", metaInformation: [] },
    { id: 1123, aisle: "Dairy", image: "eggs.jpg", name: "eggs", amount: 2, unit: "large", unitShort: "large", unitLong: "large", originalString: "2 large eggs", metaInformation: ["large"] },
    { id: 1041009, aisle: "Cheese", image: "pecorino-romano.jpg", name: "pecorino romano", amount: 50, unit: "g", unitShort: "g", unitLong: "grams", originalString: "50g Pecorino Romano", metaInformation: [] },
    { id: 1033, aisle: "Cheese", image: "parmesan.jpg", name: "parmesan", amount: 50, unit: "g", unitShort: "g", unitLong: "grams", originalString: "50g Parmesan", metaInformation: [] },
    { id: 1002030, aisle: "Spices and Seasonings", image: "black-pepper.jpg", name: "black pepper", amount: 2, unit: "tsp", unitShort: "tsp", unitLong: "teaspoons", originalString: "Black pepper", metaInformation: ["black"] }
  ],
  diets: [],
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  dairyFree: false
};

export function useRecipeDetails(recipeId: string | number | undefined) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<DetailedRecipe | null>(null);

  useEffect(() => {
    if (!recipeId) return;
    
    const fetchRecipeDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // const data = await getRecipeInformation(Number(recipeId));
        
        setRecipe(mockDetailedRecipe);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipeDetails();
  }, [recipeId]);
  
  return { recipe, loading, error };
} 