# BrainLIT - Smart Learning Platform

**Developed by Sirah Digital**

A modern webinar registration platform for BrainLIT bootcamp programs.

## Project Overview

BrainLIT is a comprehensive learning platform that helps parents register for educational webinars. The platform includes:
- User registration system with form validation
- Admin dashboard for managing registrations
- Webinar date management
- Automated webhook integration for n8n workflows
- Secure admin authentication

## How to edit this code

You can work on this project locally using your preferred IDE.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

This project is configured for deployment on Vercel. See [VERCEL-DEPLOYMENT.md](VERCEL-DEPLOYMENT.md) for complete deployment instructions.

### Quick Deploy Steps:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

For detailed instructions including database setup and environment configuration, refer to the [VERCEL-DEPLOYMENT.md](VERCEL-DEPLOYMENT.md) file.

## Features

- **Registration Form**: Validates user input with duplicate detection
- **Admin Dashboard**: Secure login with session management
- **Webinar Management**: Set and display upcoming webinar dates
- **Data Export**: Export registrations to CSV
- **Webhook Integration**: Automatic notifications via n8n
- **Database**: Supabase integration with Row Level Security

## Environment Variables

See `.env.example` for required environment variables. Never commit your `.env` file to version control.

## Credits

**Developed by Sirah Digital**  
Specialized in AI automation and web development solutions.
