<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/8c3faa3c-ed11-4077-9b15-7345251f7ebc

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This repository is configured as a GitHub Pages project site:
`https://s-meiki.github.io/shortcutmaster/`

1. Push to `main`
2. In GitHub, open `Settings > Pages`
3. Set `Build and deployment` source to `GitHub Actions`
4. Wait for the `Deploy to GitHub Pages` workflow to finish

Notes:
- Vite `base` is set to `/shortcutmaster/` for production builds.
- Local development (`npm run dev`) still works from `/`.
