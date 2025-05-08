import { motion } from "framer-motion";
import { useAnimationPrefs } from "../contexts/AnimationContext";
import { useSearch } from "../contexts/SearchContext";
import type { FormEvent } from "react";
import { CuisineSelector } from "./CuisideSelector";
import { SearchInput } from "./ui/SearchInput";

export function SearchComponent() {

    const prefersReducedMotion = useAnimationPrefs();
    const { searchTerm, setSearchTerm, handleSearch, canSearch } = useSearch();

    const search = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canSearch) return;
        handleSearch();
    }

    return (
        <motion.div
            key="centered"
            className=" min-h-[70vh]"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: -100 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
        >
            <div className="text-center mb-8 max-w-[80%] mx-auto w-full py-16">
                <h1 className="text-5xl font-bold mb-4">RecipeFinder</h1>
                <p className="text-xl text-gray-400 mb-8">Find delicious recipes for any occasion</p>
                <div className="max-w-[80%] mx-auto w-full">
                    <SearchInput
                    className="font-4xl"
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        canSearch={canSearch}
                        onSubmit={search}
                    />
                    <CuisineSelector className="mt-8 flex justify-center gap-2 w-full flex-wrap" />
                </div>
            </div>
        </motion.div>
    )
}
