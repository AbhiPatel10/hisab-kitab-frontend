'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import Navbar from '../navbar';

interface Props {
    children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();

    // const { isLoggedIn } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token && (pathname === '/signin' || pathname === '/signup')) {
            router.replace('/customers');
        }

        if (!token && pathname !== '/signin' && pathname !== '/signup') {
            router.replace('/signin');
        }
    }, [router, pathname]);

    return (
        <>
            {/* {isLoggedIn && <Navbar />} */}
            <main>{children}</main>
        </>
    );
};

export default AuthLayout;
