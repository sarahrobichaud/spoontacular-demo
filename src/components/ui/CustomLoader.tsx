import { LoaderCircle } from "lucide-react";
import { useAnimationPrefs } from "../../contexts/AnimationContext";

export function CustomLoader() {
    const { prefersReducedMotion } = useAnimationPrefs();

    return (
        <div className={`text-center py-12`}>
            {prefersReducedMotion ?
                <span className="text-2xl font-bold">Loading...</span>
            :
                <LoaderCircle className={`w-10 h-10 animate-spin ${prefersReducedMotion ? '!animate-none' : 'animate-spin'}`} />
            }
        </div>
    );
}
