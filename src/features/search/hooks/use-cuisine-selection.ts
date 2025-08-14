import { useState, useMemo } from 'react'
import { useAdvancedDebounce } from '../../../hooks/use-advanced-debounce'
import type { CuisineSelection } from '../search-types'

export function useCuisineSelection(debounceMs: number = 500): CuisineSelection {
    const [cuisines, setCuisines] = useState<string[]>([])

    const { debouncedValue: debouncedCuisines, isDebouncing } = useAdvancedDebounce(
        cuisines,
        debounceMs
    )

    const cuisineString = useMemo(() => {
        return debouncedCuisines.join(',')
    }, [debouncedCuisines])

    const selectCuisine = (cuisine: string) => {
        const normalizedCuisine = cuisine.toLowerCase().trim()
        setCuisines(prev => {
            if (prev.includes(normalizedCuisine)) {
                return prev // Already selected
            }
            return [...prev, normalizedCuisine]
        })
    }

    const deselectCuisine = (cuisine: string) => {
        const normalizedCuisine = cuisine.toLowerCase().trim()
        setCuisines(prev => prev.filter(c => c !== normalizedCuisine))
    }

    const toggleCuisine = (cuisine: string) => {
        if (cuisine === 'all') {
            clearCuisines()
            return
        }

        const normalizedCuisine = cuisine.toLowerCase().trim()
        setCuisines(prev => {
            if (prev.includes(normalizedCuisine)) {
                return prev.filter(c => c !== normalizedCuisine)
            }
            return [...prev, normalizedCuisine]
        })
    }

    const clearCuisines = () => {
        setCuisines([])
    }

    const hasCuisine = (cuisine: string) => {
        return cuisines.includes(cuisine.toLowerCase().trim())
    }

    const hasAnyCuisines = cuisines.length > 0

    return {
        cuisines,
        cuisineString,
        debouncedCuisines,
        isDebouncing,
        selectCuisine,
        deselectCuisine,
        toggleCuisine,
        clearCuisines,
        hasCuisine,
        hasAnyCuisines
    }
}