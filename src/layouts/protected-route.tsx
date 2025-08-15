import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApiKey } from '../contexts/api-key-context';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { apiKey, isLoaded } = useApiKey();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded && !apiKey) {
            navigate('/setup', { replace: true });
        }
    }, [apiKey, isLoaded, navigate]);

    if (!isLoaded) {
        return (
            <div className='min-h-screen flex items-center justify-center gradient-background text-white'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4' />
                    <p>Loading...</p>
                </div>
            </div>
        );
    }
    if (!apiKey) {
        return null;
    }

    return <>{children}</>;
}
