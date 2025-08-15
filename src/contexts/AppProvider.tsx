import type { ReactNode } from 'react'
import { AnimationProvider } from './AnimationContext'
import { ApiKeyProvider } from './ApiKeyContext'
export function AppProvider({ children }: { children: ReactNode }) {
	return (
		<AnimationProvider>
			<ApiKeyProvider>
				{children}
			</ApiKeyProvider>
		</AnimationProvider>
	)
}
