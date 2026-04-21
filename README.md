# Edit Vault

Standalone React + Vite project for tracking personal edit logs and revisions.

## Features

- Local-first storage using browser localStorage
- Add, filter, search, and sort edit entries
- Status tracking (open/closed)
- Export and import JSON backup files

## Run locally

1. Install dependencies:
   npm install
2. Start dev server:
   npm run dev
3. Build for production:
   npm run build

## GitHub setup

1. Create a new empty repository on GitHub (for example, edits-vault).
2. In this folder, run:

   git init
   git add .
   git commit -m "Initial commit: Edit Vault"
   git branch -M main
   git remote add origin https://github.com/<your-username>/edits-vault.git
   git push -u origin main

## Deploy to GitHub Pages

This repository includes a workflow at `.github/workflows/deploy-pages.yml` that
builds and deploys the app when you push to `main`.

1. In GitHub, open your repository settings.
2. Go to Pages.
3. Under Build and deployment, set Source to GitHub Actions.
4. Push to `main`.

Expected URL for this repository:

https://wickxdwrites.github.io/masterlist/
