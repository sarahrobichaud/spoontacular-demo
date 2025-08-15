import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RecipeIdeasPrompt from '../components/search/recipe-idea-prompt';
import { CustomLoader } from '../components/ui/custom-loader';
import { RecipeCard } from '../components/recipes/recipe-card';
import { useAnimationPrefs } from '../contexts/animation-context';
import type { PaginationInfo } from '../features/search/hooks/use-result-pagination';

import type { Recipe } from '../features/search/search-types';
import { Pagination } from '../components/search/pagination';
import { CuisineSelector } from '../components/search/cuisine-selector';
import { useIsMobile } from '../hooks/use-mobile';
import { Filter, LoaderCircle, X } from 'lucide-react';
import clsx from 'clsx';
import type { GlobalSearchAPI } from '../features/search/search-types';
import { useOutletContext, useSearchParams } from 'react-router';

export interface SearchPageProps {
	search: GlobalSearchAPI;
}

export default function SearchPage() {
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const { search } = useOutletContext<SearchPageProps>();
	const [searchParams, setSearchParams] = useSearchParams();
	const { prefersReducedMotion } = useAnimationPrefs();
	const isMobile = useIsMobile();

	// Pagination Management
	const pagination = search.pagination;

	// Initial URL Sync
	useEffect(() => {
		const query = searchParams.get('query') || '';
		const cuisines = searchParams.get('cuisines') || '';
		const page = pagination.activePage;

		search.syncSearchParams({
			query,
			cuisines,
			page,
		});
	}, []);

	// Keep the URL in sync
	useEffect(() => {
		const searchURL = new URLSearchParams();

		if (search.debouncedQuery.trim().length > 0) {
			searchURL.set('query', search.debouncedQuery);
		}

		if (search.cuisinesStringParam.trim().length > 0) {
			searchURL.set('cuisines', search.cuisinesStringParam);
		}

		if (pagination.activePage > 1) {
			searchURL.set('page', pagination.activePage.toString());
		}
		setSearchParams(searchURL, { replace: true });
	}, [search.debouncedQuery, search.debouncedCuisines, pagination.activePage]);

	const renderResults = () => {
		if (search.query === '') {
			return <RecipeIdeasPrompt />;
		}
		return (
			<motion.div
				key='results'
				className='w-full'
				initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
				animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
				exit={prefersReducedMotion ? {} : { opacity: 0 }}
				transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
			>
				<SearchResults
					data={search.results}
					isLoading={search.loading}
					pageRef={pagination.activePage}
				/>
			</motion.div>
		);
	};

	return (
		<div className='w-full min-h-screen'>
			<AnimatePresence mode='wait'>
				<div className={clsx('grid grid-cols-1 gap-16 lg:grid-cols-[3fr_1fr]')}>
					<div className='order-2 lg:order-1'>{renderResults()}</div>
					<div className='order-1 lg:order-2'>
						<ResultSidebar
							search={search}
							isPaginationAvailable={search.paginationIsAvailable}
							pagination={pagination}
							isMobile={isMobile}
							isFilterOpen={isFilterOpen}
							setIsFilterOpen={setIsFilterOpen}
						/>
					</div>
				</div>
			</AnimatePresence>
		</div>
	);
}

function SearchResults({
	data,
	isLoading,
	pageRef = 1,
}: { data: Recipe[]; pageRef?: number; isLoading: boolean }) {
	if (data.length === 0 && !isLoading) {
		return (
			<div className='w-full'>
				<h2 className='text-xl font-semibold mb-4'>Search Results</h2>
				<div className='my-2 text-center'>
					<h2 className='text-xl font-semibold mb-2'>No recipes found</h2>
					<p className='text-gray-600'>Try a different search term</p>
				</div>
			</div>
		);
	}

	const renderResult = () => {
		if (isLoading) {
			return <CustomLoader />;
		}
		return (
			<div className='grid grid-cols-1 gap-4'>
				{data.map((recipe: Recipe) => {
					return (
						<RecipeCard
							key={recipe.id}
							recipe={recipe}
							searchParams={
								pageRef > 1
									? new URLSearchParams({ pageRef: pageRef.toString() })
									: undefined
							}
						/>
					);
				})}
			</div>
		);
	};

	return (
		<div className='w-full'>
			<h2 className='text-xl font-semibold mb-4'>Search Results</h2>
			{renderResult()}
		</div>
	);
}

export interface ResultSidebarProps {
	search: GlobalSearchAPI;
	isPaginationAvailable: boolean;
	pagination: PaginationInfo;
	isMobile: boolean;
	isFilterOpen: boolean;
	setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ResultSidebar = ({
	search,
	isPaginationAvailable,
	pagination,
	isMobile,
	isFilterOpen,
	setIsFilterOpen,
}: ResultSidebarProps) => {
	return (
		<>
			{search.results.length > 0 && search.query.trim() !== '' && (
				<>
					<h3 className='mb-4 text-lg  font-semibold'>
						{search.totalResults}{' '}
						{search.totalResults === 1 ? 'recipe' : 'recipes'} found
					</h3>
					{isPaginationAvailable && (
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
					{search.cuisineIsPending && (
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
				<CuisineSelector
					search={search}
					className='flex gap-2 flex-wrap w-full'
				/>
			)}
		</>
	);
};
