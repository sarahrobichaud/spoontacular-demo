import Header from '../components/layout/header';
import Footer from '../components/layout/footer';
import { useAnimationPrefs } from '../contexts/animation-context';
import { useSearchFeature } from '../hooks/search/use-search';
import { Outlet } from 'react-router';
import { useMemo } from 'react';

function Layout(_props: React.PropsWithChildren) {
	const { prefersReducedMotion } = useAnimationPrefs();

	const { useGlobalSearch } = useSearchFeature();
	const globalSearch = useGlobalSearch();

	const routeContext = useMemo(() => {
		return {
			search: globalSearch,
		};
	}, [globalSearch]);

	return (
		<div
			className={`min-h-screen flex flex-col gradient-background text-white ${prefersReducedMotion ? 'no-motion' : ''}`}
		>
			<Header search={globalSearch} />
			<main className='flex-1 container mx-auto px-4 py-8'>
				<Outlet context={routeContext} />
			</main>
			<Footer />
		</div>
	);
}

export default Layout;
