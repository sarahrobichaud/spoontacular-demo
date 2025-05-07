import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'
import DefaultLayout from './layouts/Default'
import SearchPage from './pages/SearchPage'
import RecipeDetails from './pages/RecipeDetails'
import ErrorPage from './pages/ErrorPage'

import './styles/globals.css'
import './styles/tailwind.css'
import { AppProvider } from './contexts/AppProvider'


const flow = <AppProvider><DefaultLayout><Outlet /></DefaultLayout></AppProvider>;

const router = createBrowserRouter([
  {
    path: "/",
    element: flow,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <SearchPage />
      },
      {
        path: "recipe/:id",
        element: <RecipeDetails />
      }
    ]
  }
]);


function App() {

  return (
      <RouterProvider router={router} />
  )
}

export default App
