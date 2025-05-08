import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react'

interface AnimationContextType {
	prefersReducedMotion: boolean
	toggleReducedMotion: () => void
}

const AnimationContext = createContext<AnimationContextType | undefined>(
	undefined
)

export function AnimationProvider({ children }: { children: ReactNode }) {
	const browserPrefersReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches

	const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
		const saved = localStorage.getItem('prefersReducedMotion')
		return saved !== null ? saved === 'true' : browserPrefersReducedMotion
	})

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
		const handleChange = (e: MediaQueryListEvent) => {
			if (localStorage.getItem('prefersReducedMotion') === null) {
				setPrefersReducedMotion(e.matches)
			}
		}

		mediaQuery.addEventListener('change', handleChange)
		return () => mediaQuery.removeEventListener('change', handleChange)
	}, [])

	useEffect(() => {
		localStorage.setItem('prefersReducedMotion', String(prefersReducedMotion))
	}, [prefersReducedMotion])

	const toggleReducedMotion = () => {
		setPrefersReducedMotion(prev => !prev)
	}

	return (
		<AnimationContext.Provider
			value={{ prefersReducedMotion, toggleReducedMotion }}
		>
			{children}
		</AnimationContext.Provider>
	)
}

export function useAnimationPrefs() {
	const context = useContext(AnimationContext)
	if (context === undefined) {
		throw new Error('useAnimation must be used within an AnimationProvider')
	}
	return context
}
