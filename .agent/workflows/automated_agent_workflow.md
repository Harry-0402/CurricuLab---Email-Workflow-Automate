---
description: Run the automated agent to check for updates and notify users
---

# Automated Agent Workflow

This workflow installs dependencies and runs the main watcher script to check for updates and send notifications to authorized users.

1. Install dependencies
// turbo
```bash
npm install
```

2. Run the watcher script
// turbo
```bash
node scripts/watcher.js
```
