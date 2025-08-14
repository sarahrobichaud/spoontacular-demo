import type { URLSyncService, SearchParams } from './search-types'

export interface URLSyncServiceDependencies {
    navigate: (to: string, options?: { replace?: boolean }) => void
    location: { pathname: string; search: string }
}

export const urlSyncService = (dependencies: URLSyncServiceDependencies): URLSyncService => {

    const { navigate, location } = dependencies

    const isOnSearchPage = () => {
        return location.pathname === '/'
    }

    return {
        isOnSearchPage,
        updateURL(params: SearchParams): void {
            if (!isOnSearchPage()) {
                return
            }

            const searchParams = new URLSearchParams()

            if (params.query.trim()) {
                searchParams.set('q', params.query)
            }

            if (params.cuisines.trim()) {
                searchParams.set('cuisine', params.cuisines)
            }

            const queryString = searchParams.toString()
            const newURL = queryString ? `/?${queryString}` : '/'

            // Use replace to avoid adding to browser history for every search
            navigate(newURL, { replace: true })
        },

        getParamsFromURL(): Partial<SearchParams> {
            const searchParams = new URLSearchParams(location.search)

            return {
                query: searchParams.get('q') || '',
                cuisines: searchParams.get('cuisine') || ''
            }
        },
    }

}