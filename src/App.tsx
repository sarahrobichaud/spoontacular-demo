import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'
import DefaultLayout from './layouts/Default'
import SearchPage from './pages/SearchPage'
import RecipeDetails from './pages/RecipeDetails'
import ErrorPage from './pages/ErrorPage'
import { ApiKeyForm } from './components/ApiKeyForm'
import { ApiKeyProvider, useApiKey } from './contexts/ApiKeyContext'

import './styles/globals.css'
import './styles/tailwind.css'
import { AppProvider } from './contexts/AppProvider'

const AppContent = () => {
	const { apiKey, isLoaded } = useApiKey();
	
	if (!isLoaded) {
		return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
	}
	
	const defaultElement = (
		<AppProvider>
			<DefaultLayout>
				<Outlet />
			</DefaultLayout>
		</AppProvider>
	)
	
	const errorElement = (
		<AppProvider>
			<DefaultLayout>
				<ErrorPage />
			</DefaultLayout>
		</AppProvider>
	)
	
	const router = createBrowserRouter([
		{
			path: '/recipe/:id',
			element: defaultElement,
			errorElement: errorElement,
			children: [
				{
					index: true,
					element: apiKey ? <RecipeDetails /> : <ApiKeyForm />,
				},
			],
		},
		{
			path: '/',
			element: defaultElement,
			errorElement: errorElement,
			children: [
				{
					index: true,
					element: apiKey ? <SearchPage /> : <ApiKeyForm />,
				},
			],
		},
	])

	return <RouterProvider router={router} />;
};

function App() {
	return (
		<ApiKeyProvider>
			<AppContent />
		</ApiKeyProvider>
	);
}

export default App
