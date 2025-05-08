import { useState, useEffect } from 'react'
import {
	getRecipeInformation,
	type DetailedRecipe,
} from '../services/spoonacular'
import { env } from '../env'
import { mockDetailedRecipe } from '../data/mockRecipes'

export function useRecipeDetails(recipeId: string | number | undefined) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [recipe, setRecipe] = useState<DetailedRecipe | null>(null)

	useEffect(() => {
		if (!recipeId) return

		const fetchRecipeDetails = async () => {
			setLoading(true)
			setError(null)

			try {
				let data: DetailedRecipe

				if (!env.useMockData) {
					data = await getRecipeInformation(Number(recipeId))
				} else {
					data = mockDetailedRecipe
				}

				setRecipe(data)
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'An unknown error occurred'
				)
			} finally {
				setLoading(false)
			}
		}

		fetchRecipeDetails()
	}, [recipeId])

	return { recipe, loading, error }
}
