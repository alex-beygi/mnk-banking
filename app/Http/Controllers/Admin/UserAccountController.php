<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\SavingAccount;
use App\Http\Requests\BulkUserStoreRequest;
use Carbon\Carbon;
use App\Models\User;

class UserAccountController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $query = SavingAccount::query()
            ->with('user') 
            ->join('users', 'saving_accounts.user_id', '=', 'users.id')
            ->select('saving_accounts.*', 'users.first_name', 'users.last_name'); 

            if ($search = $request->input('search')) {
                $query->where(function ($q) use ($search) {
                    $q->where('users.first_name', 'like', "%{$search}%")
                      ->orWhere('users.last_name', 'like', "%{$search}%")
                      ->orWhere('saving_accounts.account_number', 'like', "%{$search}%")
                      ->orWhere('saving_accounts.balance', 'like', "%{$search}%");
                });
            }
    
        $accounts = $query->orderByDesc('saving_accounts.id')->paginate(10)->withQueryString();  
        
        return Inertia::render('Admin/User/UserAccountsPage', [
            'accounts' => $accounts,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/User/CreateUser');
    }

    private function generateUniqueAccountNumber(): string
    {
        do {
            $number = str_pad(random_int(1_000_000_000_000, 9_999_999_999_999), 15, '0', STR_PAD_LEFT);
        } while (SavingAccount::where('account_number', $number)->exists());

        return $number;
    }

    public function bulkStore(BulkUserStoreRequest $request)
    {
        $data = $request->validated();
        $createdUsers = [];
    
        try {
            DB::beginTransaction();
            
            foreach ($data['users'] as $userData) {
                $password = 'changeme123';
    
                $user = User::create([
                    'email' => $userData['email'],
                    'password' => Hash::make($password),
                    'is_admin' => false,
                    'first_name' => $userData['first_name'],
                    'last_name' => $userData['last_name'],
                    'must_change_password' => true,
                ]);
    
                SavingAccount::create([
                    'user_id' => $user->id,
                    'account_number' => $this->generateUniqueAccountNumber(),
                    'balance' => 100.00,
                    'dob' => $userData['dob'],
                    'address' => $userData['address'],
                ]);
    
                $createdUsers[] = $user;
            }
            
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create users.',
                'errors' => $e->getMessage(),
            ], 500);
        }
    
         return redirect()->route('admin.user-accounts');
        
    }
}
