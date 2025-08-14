import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useLayout } from '../contexts/LayoutContext'
import { useAnimationPrefs } from '../contexts/AnimationContext'
import { useSearchFeature } from '../features/search/hooks/use-search'
import { Outlet } from 'react-router'
import { useMemo } from 'react'

function Layout({ children }: React.PropsWithChildren) {
	const { initialShiftHappened } = useLayout()
	const { prefersReducedMotion } = useAnimationPrefs()

	const { useGlobalSearch } = useSearchFeature()
	const globalSearch = useGlobalSearch()

	const routeContext = useMemo(() => {
		return {
			search: globalSearch,
		}
	}, [globalSearch])

	return (
		<div
			className={`min-h-screen flex flex-col gradient-background text-white ${prefersReducedMotion ? 'no-motion' : ''}`}
		>
			{initialShiftHappened && (
				<>
					<Header search={globalSearch} />
					<main className='flex-1 container mx-auto px-4 py-8'>
						<Outlet context={routeContext} />
					</main>
					<Footer />
				</>
			)}
		</div>
	)
}

export default Layout
