'use client';

import { useState } from 'react';
import Link from 'next/link';
// import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    // const [menuOpen, setMenuOpen] = useState(false);

    const router = useRouter();

    const handleSignOut = () => {
        localStorage.removeItem("token");
        router.push("/signin")
    }

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Image src="https://flowbite.com/docs/images/logo.svg" alt="Flowbite Logo" width={32} height={32} />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
                </Link>

                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
                    <button
                        type="button"
                        className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <span className="sr-only">Open user menu</span>
                        <Image
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full"
                            src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                            alt="user photo"
                        />
                    </button>

                    {dropdownOpen && (
                        <div
                            className="z-50 absolute top-12 right-0 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                            id="user-dropdown"
                        >
                            {/* <div className="px-4 py-3">
                                <span className="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
                                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span>
                            </div> */}
                            <ul className="py-2 w-[100px]">
                                <li onClick={handleSignOut} className='cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white'>
                                    Sign out
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Nav links */}
                {/* <div className={`${menuOpen ? 'block' : 'hidden'} items-center justify-between w-full md:flex md:w-auto md:order-1`} id="navbar-user">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        {['Customers'].map((item) => (
                            <li key={item}>
                                <Link href="#">
                                    <span className={`block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:p-0 ${item === 'Home' ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500' : 'text-gray-900 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'}`}>
                                        {item}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div> */}
            </div>
        </nav>
    );
};

export default Navbar;
