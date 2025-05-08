import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'
import DefaultLayout from './layouts/Default'
import SearchPage from './pages/SearchPage'
import RecipeDetails from './pages/RecipeDetails'
import ErrorPage from './pages/ErrorPage'

import './styles/globals.css'
import './styles/tailwind.css'
import { AppProvider } from './contexts/AppProvider'

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
				element: <RecipeDetails />,
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
				element: <SearchPage />,
			},
		],
	},
])

function App() {
	return <RouterProvider router={router} />
}

export default App
