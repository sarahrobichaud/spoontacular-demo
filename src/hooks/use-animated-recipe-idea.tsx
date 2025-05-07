import { useEffect } from "react";
import { useState } from "react";
import { getRandomRecipeIdea } from "../data/ideas";

export const useAnimatedRecipeIdea = (intervalMs = 2000) => {
  const [recipeIdea, setRecipeIdea] = useState(getRandomRecipeIdea());
  const [color, setColor] = useState("#4F86F7");

  const generateRandomColor = () => {

    const colors = [
      "#FF5252", "#FF4081", "#E040FB", "#7C4DFF", 
      "#536DFE", "#448AFF", "#40C4FF", "#18FFFF",
      "#64FFDA", "#69F0AE", "#B2FF59", "#EEFF41",
      "#FFFF00", "#FFD740", "#FFAB40", "#FF6E40"
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRecipeIdea(getRandomRecipeIdea());
      setColor(generateRandomColor());
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return { recipeIdea, color };
};

