import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';

interface AdminDashboardProps {
  totalUsers: number;
  totalTransactions: number;
  todaysTransactions: number;
}

export default function AdminDashboard({totalUsers,totalTransactions,todaysTransactions}:AdminDashboardProps) {
  const route = useRoute();

  return (
    <AppLayout
      title="Dashboard"
      renderHeader={() => (
        <h1 className="font-semibold text-xl text-gray-800 leading-tight">
          Dashboard
        </h1>
      )}
    >
       <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
    
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href={route('admin.user-accounts')}
            className="bg-white shadow rounded-lg p-6 text-center hover:ring-2 hover:ring-red-500 transition"
          >
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-3xl font-bold text-gray-900 ">{totalUsers}</p>
          </Link>

          <Link
            href={route('admin.transactions')}
            className="bg-white shadow rounded-lg p-6 text-center hover:ring-2 hover:ring-red-500 transition"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</p>
            <p className="text-3xl font-bold text-gray-900 ">{totalTransactions}</p>
          </Link>

          <Link
            href="#"
            className="bg-white shadow rounded-lg p-6 text-center hover:ring-2 hover:ring-red-500 transition"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">Today's Transactions</p>
            <p className="text-3xl font-bold text-gray-900 ">{todaysTransactions}</p>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
