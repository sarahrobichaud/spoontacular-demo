import { useParams, useOutletContext, useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAnimationPrefs } from '../contexts/animation-context';
import { CustomLoader } from '../components/ui/custom-loader';
import type { GlobalSearchAPI } from '../types/search-types';
import { useSearchFeature } from '../hooks/search/use-search';

// Import the new child components
import { RecipeBackButton } from '../components/recipes/recipe-back-button';
import { RecipeHeader } from '../components/recipes/recipe-header';
import { RecipeMetrics } from '../components/recipes/recipe-metrics';
import { RecipeHealthLabels } from '../components/recipes/recipe-health-labels';
import { RecipeSummary } from '../components/recipes/recipe-summary';
import { RecipeIngredients } from '../components/recipes/recipe-ingredients';
import { RecipeInstructions } from '../components/recipes/recipe-instructions';
import { RecipeSourceLink } from '../components/recipes/recipe-source-link';

interface RecipeDetailsProps {
	search: GlobalSearchAPI;
}

export default function RecipeDetails() {
	const { id } = useParams();
	const { prefersReducedMotion } = useAnimationPrefs();
	const [searchParams] = useSearchParams();
	const { useRecipeDetails } = useSearchFeature();
	const { search } = useOutletContext<RecipeDetailsProps>();
	const { recipe, loading, error, searchByID } = useRecipeDetails();

	useEffect(() => {
		searchByID(Number(id));
	}, []);

	if (loading) {
		return <CustomLoader />;
	}

	if (error || !recipe) {
		return (
			<div className='text-center py-12'>
				<h2 className='text-xl font-semibold mb-4'>
					{error ? `Error loading recipe: ${error}` : 'Recipe not found'}
				</h2>
				<RecipeBackButton
					search={search}
					searchParams={searchParams}
				/>
			</div>
		);
	}

	return (
		<motion.div
			initial={prefersReducedMotion ? {} : { opacity: 0 }}
			animate={prefersReducedMotion ? {} : { opacity: 1 }}
			exit={prefersReducedMotion ? {} : { opacity: 0 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
		>
			<RecipeBackButton
				search={search}
				searchParams={searchParams}
			/>

			<div className='bg-black/10 border-2 border-gray-300/10 rounded-lg shadow-lg overflow-hidden'>
				<motion.div
					initial={prefersReducedMotion ? {} : { opacity: 0, y: -100 }}
					animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
					exit={prefersReducedMotion ? {} : { opacity: 0, y: 0 }}
					transition={
						prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }
					}
				>
					<RecipeHeader recipe={recipe} />
				</motion.div>

				<motion.div
					initial={prefersReducedMotion ? {} : { opacity: 0, y: 100 }}
					animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
					exit={prefersReducedMotion ? {} : { opacity: 0, y: 0 }}
					transition={
						prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }
					}
				>
					<div className='p-6'>
						<motion.div
							initial={prefersReducedMotion ? {} : { opacity: 0, y: 50 }}
							animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
							exit={prefersReducedMotion ? {} : { opacity: 0, y: 0 }}
							transition={
								prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }
							}
						>
							<RecipeMetrics recipe={recipe} />
						</motion.div>
						<RecipeHealthLabels recipe={recipe} />
						<motion.div
							initial={prefersReducedMotion ? {} : { opacity: 0 }}
							animate={prefersReducedMotion ? {} : { opacity: 1 }}
							exit={prefersReducedMotion ? {} : { opacity: 0, y: 0 }}
							transition={
								prefersReducedMotion ? { duration: 0 } : { duration: 1 }
							}
						>
							<RecipeSummary recipe={recipe} />
						</motion.div>
						<RecipeIngredients recipe={recipe} />
						<RecipeInstructions recipe={recipe} />
						<RecipeSourceLink recipe={recipe} />
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
}
