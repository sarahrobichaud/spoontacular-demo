const BASE_URL = 'https://api.spoonacular.com'

function getApiKey() {
	return (
		localStorage.getItem('spoonacular_api_key') ||
		import.meta.env.VITE_SPOON_API_KEY ||
		''
	)
}

async function fetchSpoonacular<T>(
	endpoint: string,
	params = {},
	options: RequestInit = { method: 'GET' }
): Promise<T> {
	const url = new URL(`${BASE_URL}${endpoint}`)
	const API_KEY = getApiKey()

	if (!API_KEY) {
		throw new Error('API key is missing')
	}

	const headers = {
		'Content-Type': 'application/json',
		'x-api-key': API_KEY,
	}

	for (const [key, value] of Object.entries(params)) {
		url.searchParams.append(key, String(value))
	}

	const response = await fetch(url, { headers, ...options })

	if (!response.ok) {
		throw new Error(`API error: ${response.status}`)
	}

	return (await response.json()) as T
}

export { fetchSpoonacular }
