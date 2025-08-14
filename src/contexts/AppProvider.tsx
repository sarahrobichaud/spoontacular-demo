import type { ReactNode } from 'react'
import { LayoutProvider } from './LayoutContext'
import { AnimationProvider } from './AnimationContext'
import { ApiKeyProvider } from './ApiKeyContext'
export function AppProvider({ children }: { children: ReactNode }) {
	return (
		<AnimationProvider>
			<ApiKeyProvider>
				<LayoutProvider>
					{children}
				</LayoutProvider>
			</ApiKeyProvider>
		</AnimationProvider>
	)
}
