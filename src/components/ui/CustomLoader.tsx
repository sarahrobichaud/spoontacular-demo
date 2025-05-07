import { LoaderCircle } from "lucide-react";

export function CustomLoader() {
    return (
        <div className="animate-spin text-center py-12">
            <LoaderCircle className="w-10 h-10" />
        </div>
    );
}
