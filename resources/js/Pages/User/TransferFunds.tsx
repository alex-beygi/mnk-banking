import React, { useState } from 'react';
import { useForm, usePage, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import useRoute from '@/Hooks/useRoute';

export default function TransferFundsPage() {
  const route = useRoute();
  const { flash } = usePage().props as any;
  const [recipientName, setRecipientName] = useState<string | null>(null);
  const [recipientError, setRecipientError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    to_account_number: '',
    amount: '',
    currency: 'USD',
  });

  const handleFindRecipient = async () => {
    setIsSearching(true);
    try {
      // Ensure CSRF token is set for session-based auth
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.get(`/api/recipient-name/${data.to_account_number}`);
      setRecipientName(response.data.name);
      setRecipientError(null);
    } catch (error) {
      setRecipientName(null);
      // Optional: log or display error
      setRecipientError((error as any)?.response?.data?.error || 'Recipient not found');
      
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirmed) {
      setConfirmed(true);
      return;
    }

    post(route('user.transfer'), {
      onSuccess: () => {
        reset();
        setRecipientName(null);
        setConfirmed(false);
      },
    });
  };

  return (
    <AppLayout title="Transfer Funds">
      <Head title="Transfer Funds" />
      <div className="max-w-2xl mx-auto py-10 px-6">
        <h1 className="text-2xl font-bold mb-6">Transfer Funds</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700">Recipient Account Number</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={data.to_account_number}
                onChange={(e) => setData('to_account_number', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
              <button
                type="button"
                onClick={handleFindRecipient}
                className="mt-1 bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
              >
                {isSearching ? '...' : 'Find'}
              </button>
            </div>
            {errors.to_account_number && (
              <p className="text-sm text-red-600 mt-1">{errors.to_account_number}</p>
            )}
            {recipientName && (
              <p className="text-sm text-green-600 mt-1">Recipient: {recipientName}</p>
            )}
            {recipientError && (
              <p className="text-sm text-red-600 mt-1">{recipientError}</p>
            )}
          </div>

          {recipientName && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={data.amount}
                  onChange={(e) => setData('amount', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
                {errors.amount && (
                  <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <select
                  value={data.currency}
                  onChange={(e) => setData('currency', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
                {errors.currency && (
                  <p className="text-sm text-red-600 mt-1">{errors.currency}</p>
                )}
              </div>

              {confirmed && (
                <div className="p-4 bg-yellow-100 text-yellow-700 rounded border border-yellow-300">
                  Are you sure you want to transfer <strong>${data.amount}</strong> {data.currency} to <strong>{recipientName}</strong>?
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                {processing ? 'Processing...' : confirmed ? 'Confirm Transfer' : 'Continue'}
              </button>
            </>
          )}
        </form>
      </div>
    </AppLayout>
  );
}