import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useLayout } from "../contexts/LayoutContext";
import { useAnimationPrefs } from "../contexts/AnimationContext";
function Layout({ children }: React.PropsWithChildren) {

    const { initialShiftHappened } = useLayout();
    const { prefersReducedMotion } = useAnimationPrefs();

    return (
        <div className={`min-h-screen flex flex-col gradient-background text-white ${prefersReducedMotion ? 'no-motion' : ''}`}>

            {initialShiftHappened &&
                <>
                    <Header />
                    <main className="flex-1 container mx-auto px-4 py-8">
                {children}
                    </main>
                    <Footer />
                </>
            }
        </div>
    );
}

export default Layout;