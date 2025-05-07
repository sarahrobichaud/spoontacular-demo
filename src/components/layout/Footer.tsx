import { useIsMobile } from "../../hooks/use-mobile";
import { useLayout } from "../../contexts/LayoutContext";
export default function Footer() {
    const isMobile = useIsMobile(); 
    const { isCentered } = useLayout();
    return (

        <footer className={`py-6 bg-black/50 border-t-2 border-gray-300/10 ${isMobile && !isCentered ? 'mb-[100px]' : ''}`}>
            <div className="container mx-auto px-4">
                <p className="text-center mb-4">© {new Date().getFullYear()} RecipeFinder. All rights reserved.</p>
            </div>
        </footer>
    );
}
