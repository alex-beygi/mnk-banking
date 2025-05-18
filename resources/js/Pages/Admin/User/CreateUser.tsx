import React,{useState} from 'react';
import AppLayout from '@/Layouts/AppLayout';
import useRoute from '@/Hooks/useRoute';
import Breadcrumb from '@/Components/Breadcrumb';
import { useForm } from '@inertiajs/react';

interface UserInput {
    first_name: string;
    last_name: string;
    email: string;
    dob: string;
    address: string;
    [key: string]: string;
}

const CreateUser: React.FC = () => {
    const route = useRoute();

    const [rows, setRows] = useState<UserInput[]>([
        { first_name: '', last_name: '', email: '', dob: '', address: '' },
    ]);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        users: rows,
    });

    const getError = (index: number, field: keyof UserInput): string | undefined => {
        const flatKey = `users.${index}.${field}`;
        return Object.entries(errors || {}).find(([key]) => key === flatKey)?.[1];
      };
    
    const addRow = () => {
        const newRows = [...rows, { first_name: '', last_name: '', email: '', dob: '', address: '' }];
        setRows(newRows);
        setData('users', newRows);
    };

    const removeRow = (index: number) => {
        if (rows.length > 1) {
            const newRows = rows.filter((_, i) => i !== index);
            setRows(newRows);
            setData('users', newRows);
        }
    };
    
    const updateRow = (index: number, field: keyof UserInput, value: string) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
        setData('users', newRows);
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
       
        post(route('admin.users.bulk-store'), {
            onSuccess: () => {
                reset();
                setRows([{ first_name: '', last_name: '', email: '', dob: '', address: '' }]);
                alert('Users created successfully!');
            },
        });
    };
    return (
        <AppLayout
            title="Bulk Create Users"
            renderHeader={() => (
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Bulk Create Users
                </h1>
            )}
        >
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <Breadcrumb 
                items={[
                    { label: 'User Accounts', href: route('admin.user-accounts') },
                    { label: 'Bulk Create Users' }
                ]} 
            />
             <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            Default password for all new users will be set to <span className="font-semibold">"changeme123"</span>. Users will be prompted to change their password upon first login.
                        </p>
                    </div>
                </div>
            </div>
             <form onSubmit={handleSubmit} autoComplete="off">
            <div className="space-y-6">
                {rows.map((user, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-4 bg-white p-4 rounded shadow">
                    <div>
                    <input
                        type="text"
                        value={user.first_name}
                        onChange={(e) => updateRow(index, 'first_name', e.target.value)}
                        placeholder="First Name"
                        required
                        className="w-full border-gray-300 rounded shadow-sm px-3 py-2"
                    />
                    {getError(index, 'first_name') && (
                        <p className="text-sm text-red-600 mt-1">{getError(index, 'first_name')}</p>
                    )}
                    </div>

                    <div>
                    <input
                        type="text"
                        value={user.last_name}
                        onChange={(e) => updateRow(index, 'last_name', e.target.value)}
                        placeholder="Last Name"
                        required
                        className="w-full border-gray-300 rounded shadow-sm px-3 py-2"
                    />
                    {getError(index, 'last_name') && (
                        <p className="text-sm text-red-600 mt-1">{getError(index, 'last_name')}</p>
                    )}
                    </div>

                    <div>
                    <input
                        type="email"
                        value={user.email}
                        onChange={(e) => updateRow(index, 'email', e.target.value)}
                        placeholder="Email"
                        required
                        className="w-full border-gray-300 rounded shadow-sm px-3 py-2"
                    />
                    {getError(index, 'email') && (
                        <p className="text-sm text-red-600 mt-1">{getError(index, 'email')}</p>
                    )}
                    </div>

                    <div>
                    <input
                        type="date"
                        value={user.dob}
                        onChange={(e) => updateRow(index, 'dob', e.target.value)}
                        placeholder="Date of Birth"
                        required
                        className="w-full border-gray-300 rounded shadow-sm px-3 py-2"
                    />
                    {getError(index, 'dob') && (
                        <p className="text-sm text-red-600 mt-1">{getError(index, 'dob')}</p>
                    )}
                    </div>

                    <div>
                    <input
                        type="text"
                        value={user.address}
                        onChange={(e) => updateRow(index, 'address', e.target.value)}
                        placeholder="Address"
                        required
                        className="w-full border-gray-300 rounded shadow-sm px-3 py-2"
                    />
                    {getError(index, 'address') && (
                        <p className="text-sm text-red-600 mt-1">{getError(index, 'address')}</p>
                    )}
                    </div>

                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={() => removeRow(index)}
                            className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                        >
                            Remove
                        </button>
                    </div>
                </div>
                ))}
            </div>

            <div className="flex justify-between mt-6">
                <button
                    type="button"
                    onClick={addRow}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                    + Add Another User
                </button>

                <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700"
                    >
                    {processing ? 'Creating...' : 'Submit Users'}
                </button>
            </div>
         </form>
           
        </div>
        </AppLayout>
    );
}

export default CreateUser;