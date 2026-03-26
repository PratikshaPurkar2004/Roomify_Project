# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Running the Project (Frontend + Backend)

This repo includes both the frontend (React/Vite) and backend (Express + MySQL).

### 1) Setup your database

1. Install and start MySQL locally (or use a hosted MySQL server).
2. Create a database named `roomify` (or update `.env` to use your chosen name).
3. Run the SQL schema to create tables:
   - You can use `backend/schema.sql` in a MySQL client to create the required tables.

### 2) Configure environment variables

Copy `backend/.env.example` to `backend/.env` and update the values for your local environment.

### 3) Start both apps

From the repo root:

```bash
npm run dev
```

This runs the frontend on `http://localhost:5173` (default) and backend on `http://localhost:5000`.

---

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
