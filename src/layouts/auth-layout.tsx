import Footer from '../components/layout/footer';
import { useAnimationPrefs } from '../contexts/animation-context';

import { ApiKeyForm } from '../components/auth/api-key-form';
import { useApiKey } from '../contexts/api-key-context';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

function AuthLayout(_props: React.PropsWithChildren) {
	const { prefersReducedMotion } = useAnimationPrefs();
	const { apiKey, isLoaded } = useApiKey();
	const navigate = useNavigate();

	useEffect(() => {
		if (isLoaded && apiKey) {
			navigate('/');
		}
	}, [isLoaded, apiKey]);

	return (
		<div
			className={`min-h-screen flex flex-col gradient-background text-white ${prefersReducedMotion ? 'no-motion' : ''}`}
		>
			<main className='flex-1 container mx-auto px-4 py-8'>
				<ApiKeyForm />
			</main>
			<Footer />
		</div>
	);
}

export default AuthLayout;
