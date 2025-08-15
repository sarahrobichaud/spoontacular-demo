import { useOutletContext } from 'react-router';
import { SearchComponent } from '../components/search/search-component';
import type { GlobalSearchAPI } from '../types/search-types';

export default function HomePage() {
	const { search } = useOutletContext<{ search: GlobalSearchAPI }>();
	return <SearchComponent search={search} />;
}
