import { use, useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutState, useLayout } from "../contexts/LayoutContext";
import RecipeIdeasPrompt from "../components/RecipeIdeaPrompt";
import { CustomLoader } from "../components/ui/CustomLoader";
import { RecipeCard } from "../components/RecipeCard";
import { useAnimationPrefs } from "../contexts/AnimationContext";
import { useSearch } from "../contexts/SearchContext";

import type { Recipe } from "../services/spoonacular";
import { useSpoonSearch } from "../hooks/use-spoon-search";
import { usePagination } from "../hooks/use-pagination";
import { i } from "framer-motion/client";
import { LoaderCircle } from "lucide-react";




export function SearchSection({ handleSearch }: { handleSearch: () => void }) {

    const { searchTerm, setSearchTerm, } = useSearch();
    const { prefersReducedMotion } = useAnimationPrefs();

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
    const { searchTerm, setSearchTerm, queryHasChanged, query} = useSearch();
    const [data, setData] = useState<Recipe[]>([]);
    const [autoSearch, setAutoSearch] = useState(false);
    const {setLayoutState} = useLayout();

    const location = useLocation();
    const { prefersReducedMotion } = useAnimationPrefs();

    const { loading, isInitialSearch,  metadata, searchResults, reset , searchRecipes} = useSpoonSearch();
    const pagination = usePagination(5, metadata.totalResults);

    const showLoader = loading || queryHasChanged;
    console.log({loading, queryHasChanged});

    const paginationAvailable = metadata.totalResults > 5;

    // Auto Search
    useEffect(() => {

        if(!autoSearch) return;

        searchRecipes({ query, page: pagination.currentPage, pageSize: 5 });

    }, [query, autoSearch]);


    // Update the results
    useEffect(() => {
        setData(searchResults);
        console.log(searchResults);
    }, [searchResults]);


    // Set the search term from the URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q');

        if (q) {
            setLayoutState(LayoutState.HEADER)
            setSearchTerm(q);
            setAutoSearch(true);
        } else if (location.pathname === '/') {
            reset();
        }
    }, [location, setSearchTerm]);

    useEffect(() => {
        console.log("active page changed");

        // if(pagination.activePage === pagination.currentPage) return;    
        searchRecipes({ query, page: pagination.activePage, pageSize: 5 });
        
    }, [pagination.activePage]);

    const handleSearch = () => {
        if(isInitialSearch) {
            setLayoutState(LayoutState.HEADER)
            setAutoSearch(true);
        }
        searchRecipes({ query: searchTerm, page: 1, pageSize: 5 });
    }


    return (
        <div className="w-full min-h-screen">
            <AnimatePresence mode="wait">
                <div className={`grid grid-cols-1 ${isCentered || searchTerm === '' || !paginationAvailable? 'lg:grid-cols-[1fr]' : 'lg:grid-cols-[3fr_1fr] gap-16'} max-h-full h-full`}>
                    <div>
                        {isCentered && <SearchSection handleSearch={handleSearch}/>}
                        {!isCentered && !showLoader && searchTerm === '' && <RecipeIdeasPrompt />}
                        {!isCentered && searchTerm !== '' &&
                            <motion.div
                                key="results"
                                className="w-full"
                                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                exit={prefersReducedMotion ? {} : { opacity: 0 }}
                                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
                            >
                            <SearchResults data={data} isLoading={showLoader}  />
                            </motion.div>}
                    </div>
                    {paginationAvailable && !isCentered && searchTerm !== '' && (
                        <div className="sticky top-[2rem] w-full h-full">
                            <h2 className="text-xl font-semibold mb-2">Results</h2>
                            <div className="flex items-center gap-2">
                                <p className="text-gray-600">Page {pagination.currentPage} of {pagination.totalPages}</p>
                                {pagination.pendingPageChange && <LoaderCircle className="w-4 h-4 animate-spin" />}
                            </div>
                            <div className="flex gap-2 w-full">
                                <button
                                    onClick={pagination.handlePreviousPage}
                                    disabled={!pagination.canGoToPreviousPage}
                                    className="w-full hover:cursor-pointer bg-gray-500/20 backdrop-blur-sm text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg border border-gray-300/30 shadow-sm hover:bg-gray-500/30 focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-500/20"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={pagination.handleNextPage}
                                    disabled={!pagination.canGoToNextPage}
                                    className="w-full hover:cursor-pointer bg-gray-500/20 backdrop-blur-sm text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg border border-gray-300/30 shadow-sm hover:bg-gray-500/30 focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-500/20"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </AnimatePresence>
        </div>
    );
}

function SearchResults({ data, isLoading }: { data: Recipe[], isLoading: boolean }) {

    console.log({data,isLoading});
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
