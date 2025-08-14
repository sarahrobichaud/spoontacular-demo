import { AnimatePresence, motion } from 'framer-motion'
import { useLayout } from '../../contexts/LayoutContext'
import { LayoutState } from '../../contexts/LayoutContext'
import { useIsMobile } from '../../hooks/use-mobile'
import { useAnimationPrefs } from '../../contexts/AnimationContext'
import { useSafeAnimations } from '../../hooks/use-safe-animations'
import { SearchInput } from '../ui/SearchInput'
import { Sparkles, TrashIcon } from 'lucide-react'
import { useApiKey } from '../../contexts/ApiKeyContext'
import type { GlobalSearchAPI } from '../../features/search/search-types'

interface HeaderProps {
	search: GlobalSearchAPI
}

export default function Header({ search }: HeaderProps) {
	const { layoutState, isCentered } = useLayout()

	const isMobile = useIsMobile()
	const { apiKey, clearApiKey } = useApiKey()
	const { prefersReducedMotion, toggleReducedMotion } = useAnimationPrefs()

	const { getNoMotionOverride } = useSafeAnimations()

	return (
		<>
			{isMobile && layoutState !== LayoutState.CENTERED && (
				<div
					className='fixed bottom-0 left-0 right-0 container mx-auto px-4 bg-black z-10 py-4 border-t-2 border-gray-300/10 min-h-[100px]'
					style={
						!prefersReducedMotion
							? {
								opacity: isCentered ? 0 : 1,
								transform: `translateY(${isCentered ? '100px' : '0'})`,
								transition:
									'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
							}
							: {
								opacity: 1,
							}
					}
				>
					<div className=''>
						<SearchInput className='text-[16px]' search={search} />
					</div>
				</div>
			)}

			<header className='py-4 bg-blur-lg backdrop-blur-sm bg-black/50 border-b-2 border-gray-300/10'>
				<div className='container mx-auto px-4 flex justify-between items-center'>
					<a
						href='/'
						className='flex items-center gap-2'
					>
						<img
							src='/logo.svg'
							alt='RecipeFinder Logo'
							className={`w-10 h-10 logo ${getNoMotionOverride()}`}
						/>
						<span className='text-2xl font-bold'>RecipeFinder</span>
					</a>
					{!isMobile && (
						<AnimatePresence>
							{layoutState === 'header' && (
								<motion.div
									className='flex-1 max-w-lg mx-4'
									initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
									animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
									exit={prefersReducedMotion ? {} : { opacity: 0 }}
									transition={
										prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }
									}
								>
									<div className='max-w-[100%]'>
										<SearchInput className='text-[16px]' search={search} />
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					)}
					<nav>
						<ul className='flex items-center gap-4'>
							<li>
								{!isMobile && apiKey && (
									<button
										type='button'
										className='button inline-block w-full'
										onClick={clearApiKey}
									>
										<div className='flex items-center gap-2'>
											<TrashIcon className='w-4 h-4' />
											<span>Swap API Key</span>
										</div>
									</button>
								)}
							</li>
							<li>
								<button
									type='button'
									className='button inline-block'
									onClick={toggleReducedMotion}
									aria-pressed={prefersReducedMotion}
								>
									<div className='flex items-center gap-2'>
										{prefersReducedMotion && <Sparkles className='w-4 h-4' />}
										{prefersReducedMotion ? 'Enable Motion' : 'Reduce Motion'}
									</div>
								</button>
							</li>
						</ul>
					</nav>
				</div>
			</header>
		</>
	)
}
