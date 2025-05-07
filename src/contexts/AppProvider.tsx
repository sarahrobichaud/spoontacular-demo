import type { ReactNode } from "react"
import { LayoutProvider } from "./LayoutContext"

export function AppProvider({ children }: { children: ReactNode }) {
    return (
        <LayoutProvider>
            {children}
        </LayoutProvider>
    )
}
