import React,{useEffect} from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import useTypedPage from '@/Hooks/useTypedPage';
import UserInfoCard from '@/Components/UserInfoCard';
import { router } from '@inertiajs/react';
import { toast } from 'react-hot-toast';


interface DashboardProps {
  user: {
    name: string;
    email: string;
    registered_at: string;  
    dob: string;
  };
  account: {
    account_number: string;
    balance: number;
  };
  transactions: {
    id: string;
    transaction_id: string;
    type: string;
    amount: number;
    currency: string;
    description: string;
    date: string;
  }[];
}

export default function Dashboard({user,account,transactions}:DashboardProps) {
  const page = useTypedPage();
  const userMustChangePassword = (page.props.auth.user?.must_change_password) ? true : false;
  const userId = page.props.auth?.user?.id;

  useEffect(() => {
    if (!userId) return;
  
    const channel = window.Echo.private(`user.${userId}`);
  
    channel.listen('.TransactionMade', (event: any) => {
      console.log('🔔 New transaction received:', event.transaction);
       // Rerender page to get the latest transactions
       toast.success('💸 New transaction received!');
       router.reload({ only: ['transactions','account'] });
    });
  
    return () => {
      window.Echo.leave(`user.${userId}`);
    };
  }, [userId]);

    return (
      <AppLayout
        title="Account Information"
        renderHeader={() => (
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-xl text-gray-800 leading-tight">
            My Account Information
          </h1>
          <Link
            href={route('user.transfer.page')}
            className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md shadow hover:bg-purple-700 transition"
          >
            Create Transaction
          </Link>
        </div>
      )}
    >
      <div className="max-w-7xl mx-auto py-10 px-6">
        <UserInfoCard
          name={user.name}
          email={user.email}
          registered_at={user.registered_at}
          dob={user.dob}
          account_number={account.account_number}
          balance={account.balance}
          must_change_password={userMustChangePassword}
        />
        
        {transactions.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No recent transactions found
          </div>
        ) : (
        <>
          <h2 className="text-xl font-semibold text-gray-800 border-b pt-6 pb-2">Recent Transactions</h2>
          {transactions.map(tx => (
            <div key={tx.transaction_id} className="text-sm text-gray-700 border-b py-2">
              <div className="flex justify-between">
                <span className="font-medium">
                  {tx.type}: ${Number(tx.amount).toFixed(2)} {tx.currency}
                </span>
                <span className="text-xs text-gray-500">{tx.date}</span>
              </div>
              <div className="text-xs text-gray-500">{tx.description}</div>
            </div>
          ))}
        </>
        )}
      </div>
      
    </AppLayout>
  );
}
