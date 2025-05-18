## 💸 MNK International Banking System

![Screenshot](https://ali-beygi.s3.eu-central-1.amazonaws.com/image.webp)

## 🚀 Features

## 🔐 Authentication & User Management
	•	User registration & login with Two-Factor Authentication
	•	User roles: Admin and Standard Users

## 💼 Account Management
	•	Each user is assigned a unique Saving Account with:
	•	Unique 15-digit account number
	•	Initial balance
	•	First name, last name, date of birth, and address

## 💸 Transaction System
	•	Transfer funds between users using account numbers
	•	Currency support: USD, EUR, GBP
	•	Automatic conversion using exchangeratesapi.io
	•	0.01 spread applied only to non-USD transfers
	•	Realtime balance update
	•	Unique transaction_id for every transaction pair
	•	Event broadcasting via Laravel Reverb and Echo

## 📊 Admin Dashboard
	•	Total Users, Total Transactions, Today’s Registrations, and Today’s Transactions
	•	Search & filter users by name, account number, or balance
	•	View all transactions with filter (debit/credit)
	•	Grouped transaction view by transaction_id to avoid duplication

## 📥 User Dashboard
	•	Personal and account details
	•	Recent transactions (Sent or Received)
	•	Polling every 5s for new transactions
	•	Live notifications via Laravel Echo + toast messages

⸻

## 🛠️ Tech Stack
	•	Backend: Laravel 11 + Sanctum + Reverb (WebSockets) + Eloquent ORM
	•	Frontend: React 18 + Inertia.js + TypeScript + Tailwind CSS
	•	Real-time: Laravel Reverb + Echo + Private Channels
	•	Database: MySQL
	•	Currency API: exchangeratesapi.io

##  📦 Installation

# Clone the repo
git clone https://github.com/alex-beygi/mnk-banking.git

# Install dependencies
composer install

npm install

# Set up your environment
cp .env.example .env

# Add your database and API keys
php artisan key:generate

php artisan migrate

# Start Laravel Reverb (WebSocket)
php artisan reverb:start

# Start development
npm run dev

php artisan serve

    