import { useOutletContext } from "react-router";
import { SearchComponent } from "../components/SearchComponent";
import type { GlobalSearchAPI } from "../features/search/search-types";

export default function HomePage() {
    const { search } = useOutletContext<{ search: GlobalSearchAPI }>()
    return <div><SearchComponent search={search} /></div>
}