import { useRouteError, isRouteErrorResponse, Link } from 'react-router'

export default function ErrorPage() {
	const error = useRouteError()

	let errorMessage = 'An unexpected error occurred'
	let statusText = ''
	let status = ''

	if (isRouteErrorResponse(error)) {
		status = error.status.toString()
		statusText = error.statusText
		errorMessage =
			error.data?.message ||
			"Sorry, this page doesn't exist or an error occurred"
	} else if (error instanceof Error) {
		errorMessage = error.message
	}

	return (
		<div className='flex items-center justify-center px-4'>
			<div className='text-center'>
				<h1 className='text-6xl font-bold text-red-500'>{status || 'Error'}</h1>
				{statusText && (
					<p className='text-xl font-medium text-gray-600 mt-2'>{statusText}</p>
				)}
				<p className='mt-4 text-gray-600'>{errorMessage}</p>
				<div className='mt-8 flex gap-2'>
					<Link
						to='/'
						className='button'
					>
						Return to Home
					</Link>
					<button
						type='button'
						onClick={() => window.history.back()}
						className='button'
					>
						Go Back
					</button>
				</div>
			</div>
		</div>
	)
}
