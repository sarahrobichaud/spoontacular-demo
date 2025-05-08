import { createContext, useContext, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { useEffect } from 'react'

export const LayoutState = {
	CENTERED: 'centered',
	HEADER: 'header',
} as const

export type LayoutState = (typeof LayoutState)[keyof typeof LayoutState]

interface LayoutContextType {
	layoutState: LayoutState
	setLayoutState: (state: LayoutState) => void
	isCentered: boolean
	initialShiftHappened: boolean
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
	const [initialShiftHappened, setInitialShiftHappened] = useState(false)
	const [layoutState, setLayoutState] = useState<LayoutState>(
		LayoutState.CENTERED
	)
	const location = useLocation()

	const evaluateLayoutState = () => {
		const params = new URLSearchParams(location.search)
		const q = params.get('q')

		if (q && location.pathname === '/') {
			setLayoutState(LayoutState.HEADER)
		} else {
			setLayoutState(LayoutState.CENTERED)
		}

		setInitialShiftHappened(true)
	}

	useEffect(() => {
		evaluateLayoutState()
	}, [location])

	useEffect(() => {
		evaluateLayoutState()
	}, [])

	return (
		<LayoutContext.Provider
			value={{
				layoutState,
				setLayoutState,
				isCentered: layoutState === LayoutState.CENTERED,
				initialShiftHappened,
			}}
		>
			{children}
		</LayoutContext.Provider>
	)
}

export function useLayout() {
	const context = useContext(LayoutContext)
	if (context === undefined) {
		throw new Error('useLayout must be used within a LayoutProvider')
	}
	return context
}
