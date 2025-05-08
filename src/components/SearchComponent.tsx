import { motion } from "framer-motion";
import { useAnimationPrefs } from "../contexts/AnimationContext";
import { useSearch } from "../contexts/SearchContext";
import type { FormEvent } from "react";

export function SearchComponent() {

    const prefersReducedMotion = useAnimationPrefs();
    const { searchTerm, setSearchTerm, handleSearch } = useSearch();

    const search = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSearch();
    }

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

            <form onSubmit={search} className="w-full max-w-xl">
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
