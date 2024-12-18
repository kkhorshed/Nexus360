# Documentation

## Recent Changes
- Removed the CRM application
- Removed the AI chat application
- Removed the marketing application
- Removed the sales-comp application
- Removed the platform login page (`Login.tsx`) from `frontend/src/routes/`
- Removed the authentication context (`AuthContext.tsx`) from `frontend/src/contexts/`
- Updated `frontend/src/main.tsx` to remove the `AuthProvider` wrapper and its import
- Deleted the `platform/auth` directory, which contained configuration and metadata files related to the authentication service

## Overview
This project now focuses on extended relationship management through the XRM app, with supporting admin functionality. The platform has been streamlined to remove the CRM, AI chat, marketing, and sales compensation applications. Any references to these applications have been removed to maintain a clean and focused codebase.
