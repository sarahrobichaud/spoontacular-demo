import type { ReactNode } from 'react';
import { AnimationProvider } from './animation-context';
import { ApiKeyProvider } from './api-key-context';
export function AppProvider({ children }: { children: ReactNode }) {
	return (
		<AnimationProvider>
			<ApiKeyProvider>{children}</ApiKeyProvider>
		</AnimationProvider>
	);
}
