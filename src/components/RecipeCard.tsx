import { Link } from "react-router";
import type { Recipe } from "../services/spoonacular";
import { motion } from "framer-motion";
import { useParallax } from "../hooks/use-parallax";
import { useAnimationPrefs } from "../contexts/AnimationContext";
import { useSafeAnimations } from "../hooks/use-safe-animations";

interface RecipeCardProps {
    recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    const { prefersReducedMotion } = useAnimationPrefs();
    const { ref, transform, handleMouseMove, handleMouseLeave } = useParallax({
        pitchFactor: 10,
        yawFactor: 15,
        perspective: 1200,
      });

    const parallaxHandlers = prefersReducedMotion ? {} : {
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave
    };

    const { getNoMotionOverride } = useSafeAnimations();
    return (
    <motion.div
      ref={ref}
      className={`bg-black/10 hover:bg-black/50 border-2 border-gray-300/10 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow scale-[0.95] hover:scale-[1] transition-transform ${getNoMotionOverride()}`}
      initial={ prefersReducedMotion ? {} : { opacity: 0 }}
      animate={ prefersReducedMotion ? {} : { opacity: 1 }}
      transition={prefersReducedMotion ? {duration: 0 }:{ duration: 0.3, delay: 0.1 }}
      style={{ transformStyle: 'preserve-3d', transform: transform }}
      {...parallaxHandlers}
    >
      <Link 
        to={`/recipe/${recipe.id}`} 
        className="block"
      >
        <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
          <div className="flex justify-between text-sm text-gray-600">
            <span>⏱️ {recipe.readyInMinutes} mins</span>
            <span>❤️ {recipe.healthScore}% Health Score</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
