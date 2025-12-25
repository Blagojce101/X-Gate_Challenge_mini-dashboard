# Mini Dashboard

A lightweight internal dashboard for support teams to efficiently manage tickets and customers. Built with React, TypeScript, Material-UI, and json-server, it offers real-time filtering, sorting, and easy navigation.

### Authentication

- Secure authentication with protected routes
- Demo accounts for testing

### Tickets Management

- **List View**: Paginated table with sorting, filtering, and search
- **Detail View**: Complete ticket information with inline editing
- **Filters**: Status, priority, and search by title/customer

### Customers Management

- **List View**: Card-based layout with customer information
- **Search**: Filter customers by name, email, or company
- **Detail View**: Customer profile with related tickets
- **Ticket Association**: View all tickets linked to a customer

### Technical Implementation

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Material-UI
- **State Management**: json-server with localStorage persistence
- **Routing**: React Router v6
- **Data Storage**: Client-side with localStorage

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn

### Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd supportops-mini-dashboard
```

2. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Run the json-server

```bash
npm run server
# or
pnpm server
# or
yarn server
```

4. The json-server runs at http://localhost:5000 by default, serving:

- `GET /tickets` - fetch all tickets
- `GET /tickets/:id` - fetch details of a ticket
- `GET /customers` - fetch all customers
- `GET /customers/:id` - fetch details of a customer
- `GET /tickets?customerId=:id` - fetch all tickets for a specific customer

5. Run the development server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

6. Open http://localhost:5173 in your browser

### Demo Accounts

**Admin Account:**

- Email: `admin@support.com`
- Password: `admin123`

**Agent Account:**

- Email: `agent@support.com`
- Password: `agent123`

## Project Structure

```
├── src/
|   ├── api/
│   │   ├── api.ts
│   │   ├── authApi.ts
│   │   ├── customersApi.ts
│   │   └── ticketsApi.ts
│   ├── components/
│   │   ├── DashboardLayout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── Table.tsx
│   │   └── ThemeSwitcher.tsx
│   ├── helpers/
│   │   └── tableDataHelper.tsx
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   └── useTickets.ts
│   ├── pages/
│   │   ├── customers/
│   │   │   ├── CustomerCard.tsx
│   │   │   ├── CustomerDetailsPage.tsx
│   │   │   └── CustomerPage.tsx
│   │   ├── login/
│   │   │   └── LoginPage.tsx
│   │   ├── tickets/
│   │   │   ├── TicketsPage.tsx
│   │   │   └── TicketDetailPage.tsx
│   ├── types/
│   │   └── types.ts
│   ├── App.tsx
│   └── main.tsx
├── db.json
├── index.html
├── vite.config.ts
└── README.md
```

### Technology Choices

1. **React + Vite**: Fast development with hot module replacement
2. **Material-UI**: Comprehensive component library with excellent theming
3. **json-server**: Lightweight state management with persistence
4. **React Router**: Standard routing for React applications
5. **TypeScript**: Type safety and better developer experience

### Architecture Patterns

1. **Protected Routes**: Authentication wrapper preventing unauthorized access
2. **Component Composition**: Reusable components following Material-UI patterns
3. **React Router**: Declarative routing with nested routes

### UX Enhancements

1. **Dark Theme**: Modern, professional appearance
2. **Responsive Design**: Mobile-first approach
3. **Search & Filters**: Multiple filter combinations for tickets
4. **Row Click Navigation**: Intuitive navigation from table rows
5. **Persistent State**: Data persists across page refreshes

## License

MIT

## Author

Built with React, TypeScript, and Material-UI demonstrating modern frontend development practices.

## Contributing

Feel free to open issues or pull requests for bug fixes, enhancements, or new features.
