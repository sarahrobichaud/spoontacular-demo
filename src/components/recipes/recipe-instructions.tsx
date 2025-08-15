import type { DetailedRecipe } from '../../types/search-types';

interface RecipeInstructionsProps {
	recipe: DetailedRecipe;
}

export function RecipeInstructions({ recipe }: RecipeInstructionsProps) {
	return (
		<div>
			<h2 className='text-xl font-semibold mb-4'>Instructions</h2>

			{recipe.analyzedInstructions.length > 0 ? (
				<div className='space-y-6'>
					{recipe.analyzedInstructions.map((instruction, idx: number) => (
						<div key={`${instruction.name}-${idx}`}>
							{instruction.name && (
								<h3 className='font-medium text-lg mb-2'>{instruction.name}</h3>
							)}
							<ol className='space-y-4'>
								{instruction.steps.map(step => {
									return (
										<li
											key={step.number}
											className='ml-6 list-decimal'
										>
											<div className='font-medium mb-1'>Step {step.number}</div>
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
																{step.ingredients.map((ing, i: number) => (
																	<span
																		key={`${ing.id}-${i}`}
																		className='text-sm glassy-badge'
																	>
																		{ing.name}
																	</span>
																))}
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
	);
}
