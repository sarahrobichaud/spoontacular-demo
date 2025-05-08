import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLayout } from "../contexts/LayoutContext";
import RecipeIdeasPrompt from "../components/RecipeIdeaPrompt";
import { CustomLoader } from "../components/ui/CustomLoader";
import { RecipeCard } from "../components/RecipeCard";
import { useAnimationPrefs } from "../contexts/AnimationContext";
import { useSearch } from "../contexts/SearchContext";

import type { Recipe } from "../services/spoonacular";
import { Pagination } from "../components/ui/Pagination";
import { SearchComponent } from "../components/SearchComponent";




export default function SearchPage() {
    const { searchTerm, pagination, loading, data, } = useSearch();

    const { isCentered } = useLayout();

    useEffect(() => {
        // Scroll to top when page changes
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    }, [pagination.currentPage]);

    const { prefersReducedMotion } = useAnimationPrefs();


    return (
        <div className="w-full min-h-screen">
            <AnimatePresence mode="wait">
                <div className={`grid grid-cols-1 ${isCentered || searchTerm === '' || data.length === 0 ? 'lg:grid-cols-[1fr]' : 'lg:grid-cols-[3fr_1fr] gap-16'}`}>
                    <div>
                        {isCentered && <SearchComponent />}
                        {!isCentered && !loading && searchTerm === '' && <RecipeIdeasPrompt />}
                        {!isCentered && searchTerm !== '' &&
                            <motion.div
                                key="results"
                                className="w-full"
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                exit={prefersReducedMotion ? {} : { opacity: 0 }}
                                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
                            >
                                <SearchResults data={data} isLoading={loading} />
                            </motion.div>}
                    </div>
                    {data.length > 0 && !isCentered && searchTerm !== '' && (
                        //here
                        <div className="sticky top-24 h-fit self-start">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">{pagination.totalResults} {pagination.totalResults === 1 ? 'recipe' : 'recipes'} found</h3>
                            </div>

                            {pagination.available &&
                                <Pagination
                                    pagination={pagination}
                                    className="w-full"
                                />
                            }
                        </div>
                    )}
                </div>
            </AnimatePresence>
        </div>
    );
}

function SearchResults({ data, isLoading }: { data: Recipe[], isLoading: boolean }) {

    if (data.length === 0 && !isLoading) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-2">No recipes found</h2>
                <p className="text-gray-600">Try a different search term</p>
            </div>
        )
    } else {
        return (
            <div className="w-full">
                <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                {isLoading && <CustomLoader />}
                {!isLoading && <div className="grid grid-cols-1 gap-4">
                    {data.map((recipe: Recipe) => {
                        return (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        )
                    })}
                </div>}
            </div>
        )
    }
}
