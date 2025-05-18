import React from 'react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
interface UserInfoCardProps {
  name: string;
  email: string;
  registered_at: string;
  dob: string;
  account_number: string;
  balance: number;
  must_change_password?: boolean;
}

export default function UserInfoCard({
  name,
  email,
  registered_at,
  dob,
  account_number,
  balance,
  must_change_password = false,
}: UserInfoCardProps) {
  return (
    <>
      {must_change_password && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                For security reasons, you must change your password. Please visit your{' '}
                <Link href={route('profile.show')} className="font-medium underline text-yellow-700 hover:text-yellow-600">
                  profile page
                </Link>{' '}
                to update it.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white shadow-md rounded-lg p-8 space-y-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Registered At</p>
            <p className="font-medium">{registered_at}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-medium">{dob}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 border-b pt-6 pb-2">Account Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="text-sm text-gray-500">Account Number</p>
            <p className="font-medium">{account_number}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Balance</p>
            <p className="font-medium">${Number(balance ?? 0).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </>
  );
}
