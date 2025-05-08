import { useState } from 'react'
import { useApiKey } from '../contexts/ApiKeyContext'

export function ApiKeyForm() {
	const [inputKey, setInputKey] = useState('')
	const [error, setError] = useState('')
	const { setApiKey } = useApiKey()

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!inputKey.trim()) {
			setError('Please enter a valid API key')
			return
		}

		setApiKey(inputKey.trim())
		setError('')
	}

	return (
		<div className='flex flex-col items-center justify-center p-4'>
			<div className='max-w-md w-full bg-black/50 backdrop-blur-sm border border-gray-300/10 rounded-lg shadow-lg p-6 text-white'>
				<h1 className='text-2xl font-bold mb-6 text-center'>
					Spoonacular API Key Required
				</h1>

				<p className='mb-4 text-gray-200'>
					To use this application, you need a Spoonacular API key. Please enter
					your API key below.
				</p>

				<form
					onSubmit={handleSubmit}
					className='space-y-4'
				>
					<div>
						<label
							htmlFor='apiKey'
							className='block text-sm font-medium mb-1 text-gray-200'
						>
							API Key
						</label>
						<input
							id='apiKey'
							type='text'
							value={inputKey}
							onChange={e => setInputKey(e.target.value)}
							className='w-full px-3 py-2 bg-gray-800/50 border border-gray-300/20 rounded-md text-white placeholder-gray-400'
							placeholder='Enter your Spoonacular API key'
						/>
						{error && <p className='mt-1 text-red-400 text-sm'>{error}</p>}
					</div>

					<button
						type='submit'
						className='button w-full'
					>
						Save API Key
					</button>
				</form>

				<div className='mt-4 text-sm text-gray-300'>
					<p>I have provided my key with the submission</p>
				</div>
			</div>
		</div>
	)
}
