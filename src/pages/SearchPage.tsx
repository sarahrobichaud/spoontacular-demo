import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useLayout } from "../contexts/LayoutContext";
import RecipeIdeasPrompt from "../components/RecipeIdeaPrompt";
import { CustomLoader } from "../components/ui/CustomLoader";
import { RecipeCard } from "../components/RecipeCard";
import { useAnimationPrefs } from "../contexts/AnimationContext";
import { useSearch } from "../contexts/SearchContext";

const mockImg = "https://placehold.co/200x150"

export interface Recipe {
    id: number;
    title: string;
    image: string;
    minutes: number;
    healthScore: number;
}

const mockRecipes: Recipe[] = [
    { id: 1, title: "Pasta Carbonara", image: mockImg, minutes: 30, healthScore: 45 },
    { id: 2, title: "Chicken Curry", image: mockImg, minutes: 45, healthScore: 70 },
    { id: 3, title: "Vegetable Stir Fry", image: mockImg, minutes: 20, healthScore: 90 },
    { id: 4, title: "Beef Tacos", image: mockImg, minutes: 25, healthScore: 60 },
    { id: 5, title: "Mushroom Risotto", image: mockImg, minutes: 40, healthScore: 75 },
    { id: 6, title: "Greek Salad", image: mockImg, minutes: 15, healthScore: 95 },
];


export function SearchSection() {

    const { searchTerm, setSearchTerm, triggerSearch } = useSearch();
    const { prefersReducedMotion } = useAnimationPrefs();

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        triggerSearch();
    };

    return (
        <motion.div
            key="centered"
            className="flex flex-col items-center justify-center min-h-[70vh]"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: -100 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
        >
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold mb-2">RecipeFinder</h1>
                <p className="text-xl text-gray-600">Find delicious recipes for any occasion</p>
            </div>

            <form onSubmit={handleSearch} className="w-full max-w-xl">
                <div className="relative interactable">
                    <input
                        type="search"
                        className="w-full px-6 py-4 text-lg rounded-full border shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search for recipes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search for recipes"
                    />
                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                        aria-label="Submit search"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </form>
        </motion.div>
    )
}

export default function SearchPage() {
    const { isCentered } = useLayout();
    const {  searchTerm, setSearchTerm,  isLoading, data, reset} = useSearch();

    const location = useLocation();
    const { prefersReducedMotion } = useAnimationPrefs();


    // Set the search term from the URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q');

        if (q) {
            setSearchTerm(q);
        }else if(location.pathname === '/') {
            reset();
        }
    }, [location, setSearchTerm]);

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {isCentered ? (
                    <SearchSection  />
                ) : (

                    isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <CustomLoader />
                        </div>
                    ) : searchTerm === '' ? (
                        <RecipeIdeasPrompt />
                    ) : (
                        <motion.div
                            key="results"
                            className="w-full"
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                            exit={prefersReducedMotion ? {} : { opacity: 0 }}
                            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
                        >
                            {data && data.results.length > 0 ? (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {data.results.map(recipe => (
                                            <RecipeCard key={recipe.id} recipe={recipe} />
                                        ))}
                                    </div>
                                </div>
                            ) : searchTerm ? (
                                <div className="text-center py-12">
                                    <h2 className="text-xl font-semibold mb-2">No recipes found</h2>
                                    <p className="text-gray-600">Try a different search term</p>
                                </div>
                            ) : null}
                        </motion.div>
                    ))}
            </AnimatePresence>
        </div>
    );
}