import type { FormEvent, HTMLAttributes } from 'react';
import type { GlobalSearchAPI } from '../../types/search-types';

interface SearchInputProps extends HTMLAttributes<HTMLFormElement> {
	search: GlobalSearchAPI;
	onSearch?: () => Promise<void>;
}

export function SearchInput({ search, onSearch, ...props }: SearchInputProps) {
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (onSearch) {
			await onSearch();
		} else {
			search.executeSearch();
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			{...props}
		>
			<div className='relative interactable'>
				<input
					type='search'
					className='w-full px-6 py-4 rounded-md border shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500'
					placeholder='Search for recipes...'
					value={search.query}
					onChange={e => search.updateQuery(e.target.value)}
					aria-label='Search for recipes'
				/>
				<button
					type='submit'
					className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 button'
					aria-label='Submit search'
					disabled={!search.canSearch}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<title>Search</title>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
						/>
					</svg>
				</button>
			</div>
		</form>
	);
}
