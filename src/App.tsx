import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';
import DefaultLayout from './layouts/default-layout';
import RecipeDetails from './pages/recipe-details-page';
import ErrorPage from './pages/error-page';
import { AppProvider } from './contexts/app-provider';
import SearchPage from './pages/result-page';
import HomePage from './pages/home-page';

import './styles/globals.css';
import './styles/tailwind.css';
import AuthLayout from './layouts/auth-layout';
import { ProtectedRoute } from './layouts/protected-route';
const AppContent = () => {
	const renderDefaultLayout = () => {
		return (
			<ProtectedRoute>
				<DefaultLayout>
					<Outlet />
				</DefaultLayout>
			</ProtectedRoute>
		);
	};
	const displayErrorPage = () => {
		return (
			<DefaultLayout>
				<ErrorPage />
			</DefaultLayout>
		);
	};

	const router = createBrowserRouter([
		{
			path: '/setup',
			element: <AuthLayout />,
		},
		{
			path: '/recipe/:id',
			element: renderDefaultLayout(),
			errorElement: displayErrorPage(),
			children: [
				{
					index: true,
					element: <RecipeDetails />,
				},
			],
		},
		{
			path: '/search',
			element: renderDefaultLayout(),
			errorElement: displayErrorPage(),
			children: [
				{
					index: true,
					element: <SearchPage />,
				},
			],
		},
		{
			path: '/',
			element: renderDefaultLayout(),
			errorElement: displayErrorPage(),
			children: [
				{
					index: true,
					element: <HomePage />,
				},
			],
		},
	]);

	return <RouterProvider router={router} />;
};

function App() {
	return (
		<AppProvider>
			<AppContent />
		</AppProvider>
	);
}

export default App;
