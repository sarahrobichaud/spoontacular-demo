import type { ReactNode } from "react"
import { LayoutProvider } from "./LayoutContext"
import { AnimationProvider } from "./AnimationContext"
export function AppProvider({ children }: { children: ReactNode }) {
    return (
        <AnimationProvider>
            <LayoutProvider>
                {children}
            </LayoutProvider>
        </AnimationProvider>
    )
}
