import type { FormEvent, HTMLAttributes } from "react";
import { CuisineSelector } from "../CuisideSelector";

interface SearchInputProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    canSearch: boolean;
}

export function SearchInput({ onSubmit , searchTerm, setSearchTerm, canSearch , ...props }: SearchInputProps & HTMLAttributes<HTMLFormElement>) {
    return (
            <form onSubmit={onSubmit} {...props}>
                <div className="relative interactable">
                    <input
                        type="search"
                        className="w-full px-6 py-4 rounded-md border shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search for recipes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search for recipes"
                    />
                    <button
                        type="submit"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 button"
                        aria-label="Submit search"
                        disabled={!canSearch}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </form>
    )
}
