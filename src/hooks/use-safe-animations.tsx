import { useAnimationPrefs } from '../contexts/AnimationContext'

export function useSafeAnimations() {
	const { prefersReducedMotion } = useAnimationPrefs()

	// Return animation properties based on preferences
	return {
		getTransition: (duration = 0.3) =>
			prefersReducedMotion ? { duration: 0 } : { duration },

		getVariants: (variants: Record<string, string | number>) =>
			prefersReducedMotion ? {} : variants,

		getTransform: (transform: string) =>
			prefersReducedMotion ? 'none' : transform,

		getNoMotionOverride: () => (prefersReducedMotion ? 'no-motion' : ''),

		prefersReducedMotion,
	}
}
