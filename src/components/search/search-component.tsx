import { motion } from 'framer-motion';
import { useAnimationPrefs } from '../../contexts/animation-context';
import { CuisineSelector } from './cuisine-selector';
import { SearchInput } from './search-input';
import type { GlobalSearchAPI } from '../../types/search-types';
import { useNavigate } from 'react-router';

interface SearchComponentProps {
	search: GlobalSearchAPI;
}

export function SearchComponent({ search }: SearchComponentProps) {
	const prefersReducedMotion = useAnimationPrefs();
	const navigate = useNavigate();
	const onSearch = async () => {
		await navigate(
			`/search?query=${search.query}&cuisines=${search.cuisinesStringParam}`
		);
	};

	return (
		<motion.div
			key='centered'
			className=' min-h-[70vh]'
			initial={prefersReducedMotion ? {} : { opacity: 0 }}
			animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
			exit={prefersReducedMotion ? {} : { opacity: 0, y: -100 }}
			transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
		>
			<div className='text-center mb-8 lg:max-w-[80%] mx-auto w-full py-16'>
				<h1 className='text-5xl font-bold mb-4'>RecipeFinder</h1>
				<p className='text-xl text-gray-400 mb-8'>
					Find delicious recipes for any occasion
				</p>
				<div className='lg:max-w-[80%] mx-auto w-full'>
					<SearchInput
						className='font-4xl'
						search={search}
						onSearch={onSearch}
					/>
					<CuisineSelector
						search={search}
						className='mt-8 flex justify-center gap-2 w-full flex-wrap'
					/>
				</div>
			</div>
		</motion.div>
	);
}
