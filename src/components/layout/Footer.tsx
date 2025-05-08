import { useIsMobile } from '../../hooks/use-mobile'
import { useLayout } from '../../contexts/LayoutContext'
import { useApiKey } from '../../contexts/ApiKeyContext'
import { TrashIcon } from 'lucide-react'
export default function Footer() {
	const isMobile = useIsMobile()
	const { isCentered } = useLayout()
	const { clearApiKey, apiKey } = useApiKey()
	return (
		<footer
			className={`py-6 bg-black/50 border-t-2 border-gray-300/10 ${isMobile && !isCentered ? 'mb-[100px]' : ''}`}
		>
			<div className='container mx-auto px-4'>
				<p className='text-center mb-4'>
					Built with ❤️ by{' '}
					<a
						href='https://github.com/sarahrobichaud'
						target='_blank'
						rel='noopener noreferrer'
					>
						Sarah Robichaud
					</a>
					{isMobile && apiKey && (
						<button
							type='button'
							className='mt-4 button inline-block w-full'
							onClick={clearApiKey}
						>
							<div className='flex items-center gap-2'>
								<TrashIcon className='w-4 h-4' />
								<span>Swap API Key</span>
							</div>
						</button>
					)}
				</p>
			</div>
		</footer>
	)
}
