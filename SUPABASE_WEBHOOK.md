# Supabase Webhook Setup Guide

To get **instant notifications** when you add a new Assignment or Announcement, you need to tell Supabase to "ping" GitHub.

## Step 1: Generate a GitHub Personal Access Token (PAT)

1.  Go to **GitHub Settings** -> **Developer settings** -> **Personal access tokens** -> **Tokens (classic)**.
2.  Click **Generate new token (classic)**.
3.  Name it `Supabase Webhook`.
4.  **Scopes**: Check `repo` (Full control of private repositories).
5.  Click **Generate token**.
6.  **COPY THIS TOKEN**. You won't see it again.

## Step 2: Create the Webhook in Supabase

1.  Go to your **Supabase Dashboard** -> **Database** -> **Webhooks**.
2.  Click **Create a new webhook**.
3.  **Name**: `Trigger GitHub Action`
4.  **Conditions**:
    -   **Table**: `change_logs` (The table where changes are recorded)
    -   **Events**: Check `INSERT`, `UPDATE`, and `DELETE`.
5.  **Type**: `HTTP Request`
6.  **HTTP Request Configuration**:
    -   **Method**: `POST`
    -   **URL**: `https://api.github.com/repos/Harry-0402/CurricuLab---Email-Workflow-Automate/dispatches`
    -   **Headers**: Add a new header:
        -   Name: `Authorization`
        -   Value: `token YOUR_GITHUB_PAT_HERE` (Paste the token you copied in Step 1)
        -   *Note: Ensure `Accept` header is `application/vnd.github.v3+json` (usually default or add it if possible)*
    -   **Body**:
        ```json
        {
          "event_type": "update_db"
        }
        ```
7.  Click **Confirm** / **Create Webhook**.

## Verification

1.  Add a new Assignment or Announcement in your app (which should insert a row into `change_logs`).
2.  Go to your GitHub Repository -> **Actions** tab.
3.  You should see a new workflow run triggered by `repository_dispatch`.
