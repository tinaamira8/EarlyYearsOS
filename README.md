# EarlyYearsOS - Professional Educator Suite

EarlyYearsOS is a comprehensive, full-stack platform designed for childcare centres and early childhood educators. It streamlines compliance, documentation, and communication through a suite of integrated tools.

## 🚀 Project Structure

-   `src/`: Frontend React application.
    -   `components/`: UI components and page views.
    -   `design-system/`: Core reusable UI components (Buttons, Inputs, Cards).
    -   `services/`: API clients, database logic (Supabase), and utility services.
    -   `store/`: State management (Zustand).
    -   `types/`: TypeScript interfaces and enums.
-   `server.ts`: Express backend serving the API and Vite middleware.
-   `firestore.rules`: Security rules for the Firestore database.
-   `firebase-blueprint.json`: Intermediate representation of the data structure.

## ⚙️ Environment Variables

The following environment variables are required for full functionality:

-   `VITE_SUPABASE_URL`: Your Supabase project URL.
-   `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous API key.
-   `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-side only).
-   `STRIPE_SECRET_KEY`: Stripe API secret key.
-   `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret.
-   `RESEND_API_KEY`: API key for the Resend email service.
-   `GEMINI_API_KEY`: Server-only Google Gemini key used by AI workflows.
-   `GEMINI_MODEL`: Text generation model; defaults to `gemini-2.5-flash`.
-   `AI_RATE_LIMIT`: Maximum AI requests per signed-in user per five-minute window.
-   `APP_URL`: Public base URL for the deployed app. Set this to `https://earlyyearsos.com` in production so payment and notification links resolve correctly.
-   `SENTRY_DSN`: Sentry DSN for backend error tracking.
-   `VITE_SENTRY_DSN`: Sentry DSN for frontend error tracking.

## 🛠 Adding New "Suite Tools"

To add a new tool to the EarlyYearsOS suite:

1.  **Define the View**: Add a new entry to the `AppView` enum in `src/services/types.ts`.
2.  **Create the Component**: Create a new React component in `src/components/`. Use the components in `src/design-system/` for visual consistency.
3.  **Register the Route**: Add the new component to the `AppRouter` in `src/AppRouter.tsx` using `lazy` loading.
4.  **Update Navigation**: Add a `NavItem` for the new view in the sidebar within `src/App.tsx`.
5.  **Update Permissions**: If the tool requires specific roles, update the `canAccess` function in `src/App.tsx`.
6.  **Database Schema**: If the tool requires new data structures, update `firebase-blueprint.json` and `firestore.rules`.

## 🎨 Design System

Always prefer components from `src/design-system/` to ensure a consistent look and feel across the platform.

-   `<Button />`: Standardized buttons with various variants (primary, secondary, ghost, etc.).
-   `<Input />`: Styled input fields with label and error support.
-   `<Card />`: Container components for grouping content.
