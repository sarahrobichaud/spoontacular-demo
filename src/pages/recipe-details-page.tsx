import {
	useParams,
	Link,
	useOutletContext,
	useSearchParams,
} from 'react-router';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAnimationPrefs } from '../contexts/animation-context';
import { CustomLoader } from '../components/ui/custom-loader';
import type { GlobalSearchAPI } from '../features/search/search-types';
import { useSearchFeature } from '../features/search/hooks/use-search';

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
				<Link
					to='/'
					className='text-blue-500 hover:underline'
				>
					Return to search
				</Link>
			</div>
		);
	}

	const healthLabels = [
		...(recipe.diets || []),
		...[
			recipe.vegetarian ? 'Vegetarian' : null,
			recipe.vegan ? 'Vegan' : null,
			recipe.glutenFree ? 'Gluten-Free' : null,
			recipe.dairyFree ? 'Dairy-Free' : null,
		].filter(Boolean),
	];

	return (
		<motion.div
			initial={prefersReducedMotion ? {} : { opacity: 0 }}
			animate={prefersReducedMotion ? {} : { opacity: 1 }}
			exit={prefersReducedMotion ? {} : { opacity: 0 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
		>
			{search.query && search.totalResults >= 1 ? (
				<Link
					to={`/search?query=${search.query}&cuisines=${search.cuisinesStringParam}&page=${searchParams.get('pageRef') ?? 1}`}
					className='button mb-4 inline-block gap-2'
				>
					<div className='flex items-center gap-2'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-5 w-5 mr-1'
							viewBox='0 0 20 20'
							fill='currentColor'
						>
							<title>Back</title>
							<path
								fillRule='evenodd'
								d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
								clipRule='evenodd'
							/>
						</svg>
						<span>Back to {search.totalResults} results</span>
					</div>
				</Link>
			) : (
				<a
					href='/'
					className='button mb-4 inline-block gap-2'
				>
					<div className='flex items-center gap-2'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-5 w-5 mr-1'
							viewBox='0 0 20 20'
							fill='currentColor'
						>
							<title>Back</title>
							<path
								fillRule='evenodd'
								d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
								clipRule='evenodd'
							/>
						</svg>
						<span>Back to search</span>
					</div>
				</a>
			)}

			<div className='bg-black/10 border-2 border-gray-300/10 rounded-lg shadow-lg overflow-hidden'>
				<div className='relative'>
					<img
						src={recipe.image}
						alt={recipe.title}
						className='w-full h-80 object-cover'
					/>
					<div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4'>
						<h1 className='text-3xl font-bold text-white'>{recipe.title}</h1>
					</div>
				</div>

				<div className='p-6'>
					<div className='flex flex-wrap gap-2 mb-6'>
						<span className='glassy-badge'>⏱️ {recipe.readyInMinutes} mins</span>
						<span className='glassy-badge'>
							❤️ {recipe.healthScore}% Health Score
						</span>
						<span className='glassy-badge'>👥 {recipe.servings} servings</span>
					</div>

					{healthLabels.length > 0 && (
						<div className='mb-6'>
							<h2 className='text-xl font-semibold mb-2'>Health Information</h2>
							<div className='flex flex-wrap gap-2'>
								{healthLabels.map((label: string | null, i: number) => {
									if (!label) return null;

									const capitalizedLabel = label
										.split(' ')
										.map(word => word.charAt(0).toUpperCase() + word.slice(1))
										.join(' ');

									return (
										<span
											key={`${label || Math.random()}-${i}`}
											className='inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full'
										>
											{capitalizedLabel}
										</span>
									);
								})}
							</div>
						</div>
					)}

					<div className='mb-8'>
						<h2 className='text-xl font-semibold mb-2'>Summary</h2>
						{/* // Only usee this is safe data (xss) */}

						<div
							className='text-gray-400'
							dangerouslySetInnerHTML={{ __html: recipe.summary }}
						/>
					</div>

					<div className='mb-8'>
						<h2 className='text-xl font-semibold mb-4'>Ingredients</h2>
						<div className='bg-gray-700/50 p-4 rounded-lg'>
							<ul className='grid grid-cols-1 md:grid-cols-2 gap-3'>
								{recipe.extendedIngredients.map((ingredient, index) => {
									const capitalizedName = ingredient.name
										.split(' ')
										.map(word => word.charAt(0).toUpperCase() + word.slice(1))
										.join(' ');

									return (
										<li
											key={`${ingredient.id}-${index}`}
											className='flex items-start'
										>
											<img
												src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
												alt={capitalizedName}
												className='w-10 h-10 object-cover rounded mr-3 mt-1'
												onError={e => {
													e.currentTarget.src = 'http://placehold.co/100x100';
												}}
											/>
											<div>
												<span className='font-medium'>{capitalizedName}</span>
												<span className='text-gray-400 block'>
													{ingredient.amount} {ingredient.unit}
												</span>
											</div>
										</li>
									);
								})}
							</ul>
						</div>
					</div>

					<div>
						<h2 className='text-xl font-semibold mb-4'>Instructions</h2>

						{recipe.analyzedInstructions.length > 0 ? (
							<div className='space-y-6'>
								{recipe.analyzedInstructions.map((instruction, idx: number) => (
									<div key={`${instruction.name}-${idx}`}>
										{instruction.name && (
											<h3 className='font-medium text-lg mb-2'>
												{instruction.name}
											</h3>
										)}
										<ol className='space-y-4'>
											{instruction.steps.map(step => {
												return (
													<li
														key={step.number}
														className='ml-6 list-decimal'
													>
														<div className='font-medium mb-1'>
															Step {step.number}
														</div>
														<p className='text-gray-400'>{step.step}</p>

														{(step.ingredients.length > 0 ||
															step.equipment.length > 0) && (
																<div className='mt-2 flex flex-wrap gap-4'>
																	{step.ingredients.length > 0 && (
																		<div className='flex items-center'>
																			<span className='text-sm text-gray-600 mr-2'>
																				Ingredients:
																			</span>
																			<div className='flex flex-wrap gap-1'>
																				{step.ingredients.map(
																					(ing, i: number) => (
																						<span
																							key={`${ing.id}-${i}`}
																							className='text-sm glassy-badge'
																						>
																							{ing.name}
																						</span>
																					)
																				)}
																			</div>
																		</div>
																	)}

																	{step.equipment.length > 0 && (
																		<div className='flex items-center'>
																			<span className='text-sm text-gray-600 mr-2'>
																				Equipment:
																			</span>
																			<div className='flex flex-wrap gap-1'>
																				{step.equipment.map((eq, i: number) => (
																					<span
																						key={`${eq.id}-${i}`}
																						className='text-sm glassy-badge'
																					>
																						{eq.name}
																					</span>
																				))}
																			</div>
																		</div>
																	)}
																</div>
															)}
													</li>
												);
											})}
										</ol>
									</div>
								))}
							</div>
						) : (
							<p className='text-gray-700 whitespace-pre-line'>
								{recipe.instructions || 'No instructions available.'}
							</p>
						)}
					</div>

					{recipe.sourceUrl && (
						<div className='mt-8 pt-4 border-t border-gray-200'>
							<a
								href={recipe.sourceUrl}
								target='_blank'
								rel='noopener noreferrer'
								className='text-blue-500 hover:underline inline-flex items-center'
							>
								<span>View original recipe</span>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-4 w-4 ml-1'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<title>Open in new tab</title>
									<path
										fillRule='evenodd'
										d='M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z'
										clipRule='evenodd'
									/>
								</svg>
							</a>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
}
