import { Link } from '@inertiajs/react';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import { Head } from '@inertiajs/react';
import  getDashboardRoute  from '@/Utils/navigation';

interface Props {
  canLogin: boolean;
  canRegister: boolean;
  laravelVersion: string;
  phpVersion: string;
}

export default function Welcome({
  canLogin,
  laravelVersion,
  phpVersion,
}: Props) {
  const route = useRoute();
  const page = useTypedPage();

  const {href} = getDashboardRoute(page.props.auth.user?.is_admin ?? false);

  return (
    <>
      <Head title="Welcome" />

      <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
        {canLogin ? (
          <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-right">
            {page.props.auth.user ? (
              <Link
                href={href}
                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href={route('login')}
                  className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                >
                  Log in
                </Link>

               
              </>
            )}
          </div>
        ) : null}

        <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow mt-10 mb-8 p-8 max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            MNK International – Banking System Project
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            This case study project was developed for{' '}
            <a
              href="https://www.mnkintl.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:underline"
            >
              MNK International
            </a>{' '}
            as a complete demonstration of a secure, multi-functional banking platform built using Laravel 11, Inertia.js, and Tailwind CSS.
          </p>

          <div className="mt-8 text-left text-gray-700 dark:text-gray-300 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">🔐 Authentication</h2>
            <ul className="list-disc ml-5">
              <li>Registration and login with Laravel Fortify & Jetstream</li>
              <li>Two-Factor Authentication (2FA) is enabled by default</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">🏦 Account Opening</h2>
            <ul className="list-disc ml-5">
              <li>Admins can create saving accounts for users with full personal info</li>
              <li>Accounts are auto-assigned a unique 15-digit account number</li>
              <li>Each new account starts with $100 USD balance</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">👥 User Account Management</h2>
            <ul className="list-disc ml-5">
              <li>Admins can list, search, and filter user accounts by name, number, or balance</li>
              <li>Each account includes a detailed transaction history</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">💸 Banking Operations</h2>
            <ul className="list-disc ml-5">
              <li>Users can transfer funds between accounts</li>
              <li>Supports multi-currency transfers (USD, GBP, EUR)</li>
              <li>Currency conversion with live rates via <a href="https://exchangeratesapi.io/" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-600">exchangeratesapi.io</a></li>
              <li>Includes a 0.01 spread for currency conversion</li>
            </ul>
          </div>

          {canLogin && !page.props.auth.user && <>
          <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-white text-center">
              Get Started
          </h2>

          <div className="mt-6 flex justify-center gap-4">
            <Link
                href={route('login')}
                className="px-8 py-4 bg-red-600 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-red-700 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-red-500 transition-colors duration-200"
              >
                Login
              </Link>
            
            </div>
          </>
          }

        <p className="mt-10 text-sm text-gray-500 dark:text-gray-400">
        This project has been built using <span className="font-semibold text-gray-700 dark:text-white">Laravel 11</span>,{' '}
        <span className="font-semibold text-gray-700 dark:text-white">React</span>, and{' '}
        <span className="font-semibold text-gray-700 dark:text-white">TypeScript</span>, powered by Inertia.js and Jetstream.
        <br />
        Laravel v{laravelVersion} (PHP v{phpVersion})
      </p>
    </div>
      </div>
    </>
  );
}
