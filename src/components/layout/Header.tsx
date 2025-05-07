import { AnimatePresence, motion } from "framer-motion"
import { useLayout } from "../../contexts/LayoutContext";
import { LayoutState } from "../../contexts/LayoutContext";
import { useIsMobile } from "../../hooks/use-mobile";
import { Link } from "react-router";
import type { ChangeEvent, FormEvent } from "react";

export default function Header() {

    const { searchTerm, setSearchTerm, layoutState, performSearch } = useLayout();

    const isMobile = useIsMobile();

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        performSearch(searchTerm);
    };

    return (
        <>
            {isMobile && layoutState !== LayoutState.CENTERED &&
                <motion.div
                    className="fixed bottom-0 left-0 right-0 container mx-auto px-4 bg-black/100 py-8 border-t-2 border-gray-300/10"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="w-full flex justify-between items-center">
                        <input
                            type="search"
                            className="w-full px-4 py-2 rounded-md border text-[24px] border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black/100"
                            placeholder="Search recipes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Search recipes"
                        />
                        <button
                            type="submit"
                            className="w-20 px-4"
                            aria-label="Submit search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            }

            <header className="py-4 bg-blur-lg backdrop-blur-sm bg-black/50 border-b-2 border-gray-300/10">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.svg" alt="RecipeFinder Logo" className="w-10 h-10 logo" />
                        <span className="text-2xl font-bold">RecipeFinder</span>
                    </Link>
                    {!isMobile &&
                        <AnimatePresence>
                            {layoutState === 'header' && (
                                <motion.form
                                    className="flex-1 max-w-lg mx-4"
                                    onSubmit={handleSearch}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="relative interactable">
                                        <input
                                            type="search"
                                            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black/50"
                                            placeholder="Search recipes..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            aria-label="Search recipes"
                                        />
                                        <button
                                            type="submit"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-1 rounded-full"
                                            aria-label="Submit search"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    }
                    <nav >
                        <ul className="flex items-center gap-4">
                            <li>
                                <button className="text-white hover:text-blue-300 interactable">
                                    Reduce Motion
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    );
}
