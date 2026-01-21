# CurricuLab Notification Agent

A background agent that monitors CurricuLab for updates (assignments, announcements) and sends email notifications to authorized users.

## Features
- **Automated Monitoring**: Checks for new updates every 10 minutes.
- **Smart Notifications**: Sends responsive HTML emails with branding.
- **Background Execution**: Runs continuously using `pm2` locally or as a web service in the cloud.
- **Health Check**: Includes a built-in HTTP server for uptime monitoring.

## Local Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Configure Environment**
    Create a `.env` file with the following variables:
    ```env
    SUPABASE_URL=your_supabase_url
    SUPABASE_KEY=your_supabase_key
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=465
    SMTP_USER=your_gmail_address
    SMTP_PASS=your_gmail_app_password
    ```

3.  **Run the Agent**
    ```bash
    # Run in foreground
    node scripts/watcher.js

    # Run in background (RECOMMENDED)
    npm run start:bg
    ```

## GitHub Actions (Serverless Automation)

This project includes a **GitHub Actions** workflow that runs automatically in the cloud.

- **Check Updates**: Runs every 10 minutes.
- **Attendance Reminders**: Runs daily at 7:00 PM and 9:00 PM IST.

### Setup Instructions

1.  Push your code to a GitHub repository.
2.  Go to **Settings** > **Secrets and variables** > **Actions**.
3.  Click **New repository secret**.
4.  Add the following secrets (values from your `.env` file):
    - `SUPABASE_URL`
    - `SUPABASE_KEY`
    - `SMTP_USER`
    - `SMTP_PASS`
    - `SMTP_HOST` (e.g., `smtp.gmail.com`)
    - `SMTP_PORT` (e.g., `465`)

Once these are set, the workflow defined in `.github/workflows/schedule.yml` will start running automatically!

## Cloud Deployment (Alternative)

1.  **Connect Repository**: Link this GitHub repo to your cloud provider.
2.  **Build Command**: `npm install`
3.  **Start Command**: `node scripts/watcher.js` (or `npm start`)
4.  **Environment Variables**:
    Add these in your dashboard settings:
    - `SUPABASE_URL`
    - `SUPABASE_KEY`
    - `SMTP_USER`
    - `SMTP_PASS`
    - `SMTP_HOST` (default: `smtp.gmail.com`)
    - `SMTP_PORT` (default: `465`)

> **Note on SMTP**: Render blocks port 25 but allows ports 587 and 465. We use port 465 (SSL) by default, so email sending works without issues.

## Management

- **Logs**: `npm run logs:bg`
- **Stop**: `npm run stop:bg`
