import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Pagination from '@/Components/Pagination';
import { useRoute } from 'ziggy-js';
import { Link } from '@inertiajs/react';



interface Account {
  id: number;
  first_name: string;
  last_name: string;
  account_number: string;
  balance: number;
  dob:string;
  address:string;

}

interface PageProps {
  accounts: {
    data: Account[];
    links: any[];
    current_page: number;
    last_page: number;
  };
  filters: {
    search?: string;
  };
}

export default function UserAccountsPage({accounts, filters}: PageProps) {
 
  const [search, setSearch] = React.useState(filters.search || '');
  const route = useRoute();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('admin.user-accounts'), { search }, { preserveState: true, replace: true });
  };

  const handlePageChange = (selectedPage: number) => {
    router.get(
      window.location.pathname,
      { page: selectedPage },
      { replace: true },
    );
  };
  

  return (
    <AppLayout
      title="User Accounts"
      renderHeader={() => (
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-xl text-gray-800 leading-tight">User Accounts</h1>
          <Link
            href={route('admin.users.create')}
            className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md shadow hover:bg-purple-700 transition"
          >
            Bulk Create Users
          </Link>
        </div>
      )}
    >
      <Head title="User Accounts" />

      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSearch} className="mb-6 flex w-full max-w-xl">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by first name, last name, account number, or balance"
        className="flex-1 rounded-l-md border border-gray-300 px-4 py-2 shadow-sm focus:ring-purple-500 focus:border-purple-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-r-md shadow hover:bg-purple-700 transition"
      >
        Search
      </button>
    </form>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Account Number</th>
                <th className="px-4 py-2">Balance</th>
                <th className="px-4 py-2">Date of Birth</th>
                <th className="px-4 py-2">Address</th>
              </tr>
            </thead>
            <tbody>
              {accounts.data.map((account) => (
                <tr key={account.id} className="border-t border-gray-100">
                  <td className="px-4 py-2 text-gray-800">
                    {account.first_name} {account.last_name}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{account.account_number}</td>
                  <td className="px-4 py-2 text-gray-700">
                    ${parseFloat(account.balance as any).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    {account.dob}
                  </td>
                  <td className="px-4 py-2">
                    {account.address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       
        {accounts.last_page > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={accounts.current_page}
              totalPages={accounts.last_page}
              onPageChange={handlePageChange}
            />
          </div>
        )}

      </div>
    </AppLayout>
  );
}