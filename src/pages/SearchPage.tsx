import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLayout } from '../contexts/LayoutContext'
import RecipeIdeasPrompt from '../components/RecipeIdeaPrompt'
import { CustomLoader } from '../components/ui/CustomLoader'
import { RecipeCard } from '../components/RecipeCard'
import { useAnimationPrefs } from '../contexts/AnimationContext'
import { useSearch } from '../contexts/SearchContext'

import type { Recipe } from '../services/spoonacular'
import { Pagination } from '../components/ui/Pagination'
import { SearchComponent } from '../components/SearchComponent'
import { CuisineSelector } from '../components/CuisideSelector'
import { useIsMobile } from '../hooks/use-mobile'
import { Filter, LoaderCircle, X } from 'lucide-react'
import clsx from 'clsx'

export default function SearchPage() {
	const { searchTerm, pagination, loading, data, query, cuisineHasChanged } =
		useSearch()
	const [isFilterOpen, setIsFilterOpen] = useState(false)

	const { isCentered } = useLayout()

	useEffect(() => {
		// Scroll to top when page changes
		window.scrollTo({
			top: 0,
			behavior: prefersReducedMotion ? 'auto' : 'smooth',
		})
	}, [pagination.currentPage])

	const { prefersReducedMotion } = useAnimationPrefs()

	const isMobile = useIsMobile()

	return (
		<div className='w-full min-h-screen'>
			<AnimatePresence mode='wait'>
				<div
					className={clsx('grid grid-cols-1 gap-16', {
						'lg:grid-cols-[3fr_1fr]': !isCentered,
					})}
				>
					<div className='order-2 lg:order-1'>
						{isCentered && <SearchComponent />}
						{!isCentered && !loading && searchTerm === '' && (
							<RecipeIdeasPrompt />
						)}
						{!isCentered && searchTerm !== '' && (
							<motion.div
								key='results'
								className='w-full'
								initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
								animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
								exit={prefersReducedMotion ? {} : { opacity: 0 }}
								transition={
									prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }
								}
							>
								<SearchResults
									data={data}
									isLoading={loading}
								/>
							</motion.div>
						)}
					</div>
					{!isCentered && (
						<div className='order-1 lg:order-2'>
							{data.length > 0 && query.trim() !== '' && (
								<>
									<h3 className='mb-4 text-lg  font-semibold'>
										{pagination.totalResults}{' '}
										{pagination.totalResults === 1 ? 'recipe' : 'recipes'} found
									</h3>
									{pagination.available && (
										<Pagination
											pagination={pagination}
											className='w-full'
										/>
									)}
								</>
							)}

							<div
								className={clsx('flex justify-between gap-2 w-full', {
									'my-4 p-2 border-y border-gray-300/10': isMobile,
								})}
							>
								<h3 className='my-4 text-lg font-semibold flex items-center gap-2'>
									Filter by cuisine
									{cuisineHasChanged && (
										<LoaderCircle className='w-4 h-4 animate-spin' />
									)}
								</h3>
								{isMobile && (
									<button
										type='button'
										onClick={() => setIsFilterOpen(prev => !prev)}
										className='button'
									>
										{isFilterOpen ? (
											<X className='w-4 h-4' />
										) : (
											<Filter className='w-4 h-4' />
										)}
									</button>
								)}
							</div>
							{((isMobile && isFilterOpen) || !isMobile) && (
								<CuisineSelector className='flex gap-2 flex-wrap w-full' />
							)}
						</div>
					)}
				</div>
			</AnimatePresence>
		</div>
	)
}

function SearchResults({
	data,
	isLoading,
}: { data: Recipe[]; isLoading: boolean }) {
	if (data.length === 0 && !isLoading) {
		return (
			<div className='w-full'>
				<h2 className='text-xl font-semibold mb-4'>Search Results</h2>
				<div className='my-2 text-center'>
					<h2 className='text-xl font-semibold mb-2'>No recipes found</h2>
					<p className='text-gray-600'>Try a different search term</p>
				</div>
			</div>
		)
	}
	return (
		<div className='w-full'>
			<h2 className='text-xl font-semibold mb-4'>Search Results</h2>
			{isLoading && <CustomLoader />}
			{!isLoading && (
				<div className='grid grid-cols-1 gap-4'>
					{data.map((recipe: Recipe) => {
						return (
							<RecipeCard
								key={recipe.id}
								recipe={recipe}
							/>
						)
					})}
				</div>
			)}
		</div>
	)
}
