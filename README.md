# Smart Edu Hub

Smart Edu Hub is a React-based learning platform for students, teachers, and administrators. It brings courses, lessons, bookings, chat, a digital library, quizzes, achievements, and progress tracking into one application.

## Features

- Role-based experiences for students, teachers, and administrators
- Course and lesson management
- Teacher-student bookings and communication
- Global and course-specific chat
- Digital library with PDF reading
- Interactive quizzes and game-based learning
- Student achievements and progress tracking
- Responsive Progressive Web App support

## Tech Stack

- React 19 and Vite
- React Router
- Redux Toolkit and Redux Persist
- Firebase Authentication and Realtime Database
- Supabase
- Tailwind CSS
- Recharts

## Getting Started

### Requirements

- Node.js >= 20
- npm

### Installation

```bash
npm install
```

Create a local environment file from the example and add your Firebase and Supabase configuration:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

## Environment Variables

The required variable names are listed in `.env.example`. Keep your real `.env` file private and configure the same variables in your hosting provider.

## License

This project is for educational and development use.
