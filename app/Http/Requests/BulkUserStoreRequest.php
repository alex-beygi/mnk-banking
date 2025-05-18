<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkUserStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'users' => 'required|array|min:1',
            'users.*.first_name' => 'required|string|max:255',
            'users.*.last_name' => 'required|string|max:255',
            'users.*.email' => 'required|email|unique:users,email',
            'users.*.dob' => 'required|date',
            'users.*.address' => 'required|string|max:1000',
        ];
    }
    public function attributes(): array
    {
        $attributes = [];

        foreach ($this->input('users', []) as $index => $user) {
            $attributes["users.$index.first_name"] = "first name (row " . ($index + 1) . ")";
            $attributes["users.$index.last_name"] = "last name (row " . ($index + 1) . ")";
            $attributes["users.$index.email"] = "email (row " . ($index + 1) . ")";
            $attributes["users.$index.dob"] = "date of birth (row " . ($index + 1) . ")";
            $attributes["users.$index.address"] = "address (row " . ($index + 1) . ")";
        }

        return $attributes;
    }
}
