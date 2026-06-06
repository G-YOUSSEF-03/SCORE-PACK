# SCORE PACK Backend

Laravel API backend for the SCORE PACK React frontend.

## Stack

- Laravel
- SQLite
- Sanctum token authentication

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Make sure the database is configured for SQLite:

```env
DB_CONNECTION=sqlite
```

Create the SQLite database file if it does not exist:

```bash
php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
```

Run the backend:

```bash
php artisan config:clear
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve
```

Default admin account:

```text
Email: youssef.admin@scorepack.ma
Password: password
```

## API

The API is served under `/api`.

Public endpoints:

- `GET /api/public/services`
- `GET /api/public/projects`
- `POST /api/public/quote-requests`
- `POST /api/public/contact-messages`

Admin endpoints require a Sanctum bearer token:

- `POST /api/auth/login`
- `GET /api/auth/profile`
- `POST /api/auth/logout`
- `GET /api/admin/dashboard`
- `api/admin/services`
- `api/admin/projects`
- `api/admin/quote-requests`
- `api/admin/contact-messages`
- `api/admin/users`
