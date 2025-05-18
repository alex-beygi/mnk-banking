import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import { route } from 'ziggy-js';
import { router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

interface Transaction {
  id: number;
  transaction_id: string;
  type: string;
  amount: number;
  currency: string;
  sender: string;
  receiver: string;
  date: string;
  current_page: number;
  last_page: number;
}

interface PageProps {
  transactions: {
    data: Transaction[];
    links: any[];
    current_page: number;
    last_page: number;
  };
  filters: {
    type?: string;
  };
}

export default function TransactionIndex({ transactions, filters }: PageProps) {


  const initialType = filters?.type || '';

  const [typeFilter, setTypeFilter] = useState(initialType);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTypeFilter(value);

    router.get(route('admin.transactions'), {
      type: value || undefined,
    }, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const handlePageChange = (selectedPage: number) => {
    router.get(
      window.location.pathname,
      { page: selectedPage, type: typeFilter },
      { replace: true },
    );
  };
  return (
      <AppLayout
      title="All Transactions"
      renderHeader={() => (
          <h1 className="font-semibold text-xl text-gray-800 leading-tight">
              All Transactions
          </h1>
      )}
  >
      <div className="max-w-7xl mx-auto py-10 px-6">
        <Breadcrumb 
                items={[
                    { label: 'Dashboard', href: route('admin.dashboard') },
                    { label: 'All Transactions' }
                ]} 
        />
        <div className="mb-4">
      <label htmlFor="typeFilter" className="text-sm font-medium text-gray-700 mr-2">
        Filter by Type:
      </label>
      <select
        id="typeFilter"
        value={typeFilter}
        onChange={handleTypeChange}
        className="border px-3 py-2 rounded shadow-sm text-sm"
      >
        <option value="">All Types</option>
        <option value="debit">Sent (Debit)</option>
        <option value="credit">Received (Credit)</option>
      </select>
    </div>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          
      <table className="min-w-full table-auto text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase text-gray-600">
          <tr>
            <th className="px-6 py-3">Transaction ID</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Amount</th>
            <th className="px-6 py-3">Sender</th>
            <th className="px-6 py-3">Receiver</th>
            <th className="px-6 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.data.length > 0 ? (
            transactions.data.map((tx) => (
              <tr key={tx.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-xs text-gray-500">{tx.transaction_id}</td>
                <td className="px-6 py-4">{tx.type}</td>
                <td className="px-6 py-4">
                  ${Number(tx.amount).toFixed(2)} {tx.currency}
                </td>
                <td className="px-6 py-4">{tx.sender}</td>
                <td className="px-6 py-4">{tx.receiver}</td>
                <td className="px-6 py-4">{tx.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center text-gray-500 py-6">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
        {transactions.data.length > 0 && (
        <div className="mt-6">
        <Pagination
          currentPage={transactions.current_page}
          totalPages={transactions.last_page}
          onPageChange={handlePageChange}
        />
      </div>
        )}
      </div>
    </AppLayout>
  );
}