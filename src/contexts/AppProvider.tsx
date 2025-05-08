import type { ReactNode } from 'react'
import { LayoutProvider } from './LayoutContext'
import { AnimationProvider } from './AnimationContext'
import { SearchProvider } from './SearchContext'
import { ApiKeyProvider } from './ApiKeyContext'
export function AppProvider({ children }: { children: ReactNode }) {
	return (
		<AnimationProvider>
			<ApiKeyProvider>
				<LayoutProvider>
					<SearchProvider>{children}</SearchProvider>
				</LayoutProvider>
			</ApiKeyProvider>
		</AnimationProvider>
	)
}
