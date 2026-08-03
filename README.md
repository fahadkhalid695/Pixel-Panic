# Pixel Panic

Pixel Panic is a browser-based competitive multiplayer arcade game built with React, TypeScript, and Vite.

## Current Status

The repository currently includes the initial production scaffold and the next module in the delivery plan:
- project setup
- app shell and screen routing
- main menu module

## Scripts

- `npm run dev` - start the local development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run typecheck` - run TypeScript project checks
- `npm run lint` - run ESLint

## Project Structure

- `src/app` - application shell and top-level composition
- `src/modules/main-menu` - main menu module
- `src/modules/app-shell` - screen routing and placeholder module boundaries
- `src/styles` - global styles

## Environment Variables

No environment variables are required yet for the current scaffold. When backend services, matchmaking, or production configuration are introduced, document them in this file and add a matching `.env.example`.

## Production Readiness Notes

The current implementation builds successfully and has an ESLint configuration in place.

The next planned work is the lobby and matchmaking module.
