## Project Overview

This is a full-stack web application for conducting surveys related to the Transjakarta bus fleet. It is built using the Next.js framework (App Router) for the frontend and backend API routes. Prisma is used as the ORM to interact with a MySQL database, and Tailwind CSS is used for styling.

The application allows administrators and surveyors to manage and conduct fleet surveys. Key entities in the system include:
- **Users (`user`)**: Can be administrators or surveyors.
- **Fleet & Service Types (`fleet_type`, `service_type`)**: Classifications for the vehicles being surveyed.
- **Question Sets (`armada_question_set`)**: Groups of questions tailored for specific fleet and service types.
- **Surveys (`armada_survey`)**: The main data collection entity, where a surveyor records answers to a question set for a specific vehicle at a specific time.

The project uses Indonesian language for database schema fields and likely for the UI components, indicating its target audience.

## Building and Running

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env` file in the root directory and add the database connection string. Prisma relies on this to connect to the database.
    ```
    DATABASE_URL="mysql://user:password@host:port/database_name"
    ```

3.  **Database Migration:**
    Apply the existing database migrations to set up the schema.
    ```bash
    npx prisma migrate dev
    ```

4.  **Seed the Database:**
    Populate the database with initial data (e.g., user levels, service types).
    ```bash
    npm run seed
    ```

5.  **Run Development Server:**
    Start the Next.js development server.
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

6.  **Build for Production:**
    Create a production-ready build.
    ```bash
    npm run build
    ```

7.  **Start Production Server:**
    Run the optimized production server.
    ```bash
    npm run start
    ```

## Development Conventions

*   **Database Naming:** The Prisma schema uses `snake_case` for all model and field names (e.g., `service_type`, `created_at`).
*   **Framework:** The project is built on Next.js with the App Router. Server Components are likely used for data fetching, and Client Components for interactivity.
*   **Styling:** Styling is done using Tailwind CSS.
*   **API:** Backend API routes are located in `src/app/api/`.
*   **Authentication:** The application includes user authentication, with MFA (Multi-Factor Authentication) as an option.
*   **Language:** The primary language used in the codebase for business logic (e.g., database fields) is Indonesian.
