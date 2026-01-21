---
description: Check for new CurricuLab updates and send notifications
---

# CurricuLab Notification Agent

This workflow connects to the CurricuLab Supabase database, checks for new announcements, assignments, or resources since the last run, and sends notifications.

1. Install dependencies (First run only)
// turbo
```bash
npm install
```

2. Run the Watcher Agent
// turbo
```bash
node scripts/watcher.js
```

3. Check logs for details
```bash
cat logs/notifications.log
```
