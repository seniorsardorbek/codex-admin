# Admin Panel

A modern admin panel built with React, TailwindCSS, React Router DOM, TanStack Query, and Redux Toolkit.

## Features

- **Authentication**: Secure login with JWT tokens stored in HTTP-only cookies
- **User Management**: Full CRUD operations for users
- **Dashboard**: Overview statistics and recent activity
- **Modern UI**: shadcn/ui inspired design with TailwindCSS
- **Responsive Layout**: Sidebar and navbar layout
- **Type Safety**: Built with TypeScript
- **State Management**: Redux Toolkit for auth state
- **Data Fetching**: TanStack Query for server state management

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS v4** - Styling
- **React Router DOM** - Routing
- **TanStack Query** - Server state management
- **Redux Toolkit** - Client state management
- **Axios** - HTTP client

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   ├── layout/
│   │   ├── MainLayout.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Table.tsx
├── pages/
│   ├── auth/
│   │   └── LoginPage.tsx
│   ├── users/
│   │   ├── UsersListPage.tsx
│   │   ├── UserDetailPage.tsx
│   │   └── UserFormPage.tsx
│   └── DashboardPage.tsx
├── services/
│   ├── auth.service.ts
│   └── users.service.ts
├── store/
│   ├── authSlice.ts
│   └── index.ts
├── hooks/
│   ├── useAppDispatch.ts
│   └── useAppSelector.ts
├── types/
│   └── index.ts
├── utils/
│   ├── axios.ts
│   └── queryClient.ts
├── App.tsx
└── main.tsx
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running (see [API_QUICK_REFERENCE.md](../../API_QUICK_REFERENCE.md))

### Installation

1. Navigate to the admin directory:
```bash
cd clients/admin
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Available Routes

- `/login` - Login page
- `/` - Dashboard (protected)
- `/users` - Users list (protected)
- `/users/:id` - User details (protected)
- `/users/:id/edit` - Edit user (protected)
- `/users/new` - Create new user (protected)

## Authentication

The app uses JWT tokens stored in HTTP-only cookies. When you sign in:

1. User credentials are sent to `/auth/sign-in`
2. Server sets an `access_token` cookie
3. All subsequent requests automatically include the cookie
4. Token is verified on protected routes

To logout, click the "Logout" button in the navbar.

## User Roles

- **STUDENT** - Regular user
- **TEACHER** - Elevated privileges
- **ADMIN** - Full access

## API Integration

The admin panel integrates with the following API endpoints:

### Authentication
- `POST /auth/sign-in` - Login
- `GET /auth/` - Verify token

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

See [API_QUICK_REFERENCE.md](../../API_QUICK_REFERENCE.md) for detailed API documentation.

## Styling

The app uses TailwindCSS v4 with a design inspired by shadcn/ui:

- **Color Palette**: Slate-based neutral colors
- **Components**: Custom-built reusable components
- **Typography**: Clean and modern font styling
- **Spacing**: Consistent spacing scale

## State Management

### Redux (Client State)
- **Auth State**: User authentication status and user info
- Located in `src/store/authSlice.ts`

### TanStack Query (Server State)
- **Users Data**: Fetching and caching user data
- **Mutations**: Create, update, delete operations
- Configured in `src/utils/queryClient.ts`

## TypeScript Types

All API types are defined in `src/types/index.ts`:

- `User` - User entity
- `AuthResponse` - Authentication response
- `CreateUserDto` - Create user payload
- `UpdateUserDto` - Update user payload
- `UserRole` - User role enum
- `Language` - Language enum

## Development Tips

1. **Hot Module Replacement**: Vite provides instant updates during development
2. **Type Safety**: Use TypeScript types for all API calls
3. **Error Handling**: Errors are displayed in the UI with helpful messages
4. **Loading States**: Loading spinners show during async operations
5. **Form Validation**: Client-side validation before API calls

## Troubleshooting

### CORS Issues
Make sure your backend API has CORS enabled for `http://localhost:5173`

### Cookie Not Being Sent
Ensure `withCredentials: true` is set in axios config (already configured)

### 401 Unauthorized
Check that your API is running and the `VITE_API_BASE_URL` is correct

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT
