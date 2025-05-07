import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'
import DefaultLayout from './layouts/default'
import SearchPage from './pages/SearchPage'
import RecipeDetails from './pages/RecipeDetails'
import ErrorPage from './pages/ErrorPage'

import './App.css'
const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout><Outlet /></DefaultLayout>,
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
