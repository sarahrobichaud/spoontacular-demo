import type { ReactNode } from "react"
import { LayoutProvider } from "./LayoutContext"
import { AnimationProvider } from "./AnimationContext"
import { SearchProvider } from "./SearchContext"
export function AppProvider({ children }: { children: ReactNode }) {
    return (
        <AnimationProvider>
            <LayoutProvider>
                <SearchProvider>   
                    {children}
                </SearchProvider>
            </LayoutProvider>
        </AnimationProvider>
    )
}
