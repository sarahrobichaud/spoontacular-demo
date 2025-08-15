import { motion } from 'framer-motion';
import { useAnimatedRecipeIdea } from '../../hooks/use-animated-recipe-idea';
import { useAnimationPrefs } from '../../contexts/animation-context';
import { AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../../hooks/use-mobile';

export default function RecipeIdeasPrompt() {
	const { recipeIdea, color } = useAnimatedRecipeIdea();
	const isMobile = useIsMobile();
	const { prefersReducedMotion } = useAnimationPrefs();

	return (
		<motion.div
			className='py-12 text-center'
			initial={prefersReducedMotion ? {} : { opacity: 0 }}
			animate={prefersReducedMotion ? {} : { opacity: 1 }}
			exit={prefersReducedMotion ? {} : { opacity: 0 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
		>
			<div className='max-w-xl mx-auto px-4'>
				<h2 className='text-2xl font-semibold mb-6'>
					Looking for recipe ideas?
				</h2>
				<p className='text-xl mb-8'>
					<AnimatePresence mode='wait'>
						<motion.span
							key={recipeIdea}
							initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
							animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
							exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
							style={{
								color,
								display: 'inline-block',
								filter: `drop-shadow(0 0 4em ${color})`,
							}}
							className='font-bold mx-1'
							transition={
								prefersReducedMotion
									? { duration: 0 }
									: { duration: 0.2, ease: 'easeInOut' }
							}
						>
							{recipeIdea}
						</motion.span>
					</AnimatePresence>
				</p>
				<p className='text-gray-400 mt-6'>
					{isMobile
						? 'Type in the search box below to find recipes'
						: 'Type in the search box above to find recipes'}
				</p>
			</div>
		</motion.div>
	);
}
