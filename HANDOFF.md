# Handoff Document: BoxedUp (Smart Storage OS)

## Project Overview
**BoxedUp** is a mobile-first PWA for managing storage inventory using QR codes. Users can create "Containers," add items with photos/tags/expiry dates, and generate printable labels that link directly to the digital record.

## Current Status (End of Session: Feb 2, 2026)
The project is in a stable, feature-complete state for "Phase 1-6" of the implementation plan. All terminology has been refactored from "Tubs" to **Containers**.

### Key Features Implemented
1.  **Direct-Link QR Scanning**: 
    - QR codes now generate as URLs (`${origin}/containers/${id}`).
    - **Result**: Native mobile cameras (iOS/Android) recognize codes instantly. The internal app scanner (`/scan`) also handles these URLs and falls back to old JSON formats.
2.  **Advanced Printing Flow**:
    - Supports **Standard Paper** (Avery 5160, 22806).
    - Supports **Thermal Printers** (4x6, 3x2, 2.25x1.25) with dynamic `@page` CSS sizing for auto-detection.
3.  **Desktop Optimization**:
    - Sidebar navigation with a `MainLayout` wrapper for authenticated routes.
    - Landing and Login pages remain correctly centered (no sidebar padding).
4.  **Voice Assistant (Stable)**:
    - Integrated with Web Speech API. Use "Where is my [item]?" to trigger searches.
    - UI: Integrated into the sidebar (Desktop) and floating (Mobile).
5.  **PWA Support**:
    - Configured via `vite-plugin-pwa`. Use `InstallPrompt.jsx` for home-screen prompts.

## Technology Stack
- **Frontend**: Vite + React
- **Backend**: Supabase (Auth, DB, Storage)
- **Styling**: Vanilla CSS (Global Variables, Glassmorphism theme in `index.css`)
- **Icons**: Lucide-React
- **QR Engine**: `qrcode` (Generation) & `html5-qrcode` (Scanning)

## Architecture & Important Paths
- `/src/components/layout`: Contains `MainLayout.jsx` (Sidebar logic) and `Navbar.jsx`.
- `/src/components/pwa`: Contains `useVoiceAssistant.js`, `VoiceModal.jsx`, and PWA logic.
- `/src/components/tubs`: Contains `PrintModal.jsx` (handles all label logic and thermal CSS).
- `/src/pages`: 
    - `ContainersList.jsx`: The main inventory grid (supports multi-select for batch printing).
    - `ContainerDetails.jsx`: Item management for a specific container.
    - `Scan.jsx`: The camera scanner interface.

## Known Notes / Considerations
- **QR Redirects**: If the app is moved to a new domain, existing printed QR codes will still point to the old domain. A permanent redirect strategy at the domain level might be needed in the future.
- **Permissions**: Voice and Camera features require HTTPS. On local dev (`localhost`), they work fine, but deployment requires a secure connection.

## Recommended Next Steps
1.  **Landing Page Polish**: The landing page (`/pages/Landing.jsx`) is functional but could use more "marketing" flair to match the premium app aesthetic.
2.  **Location Management**: Implement the `locations` table logic (currently just text strings).
3.  **Global Search Enhancements**: Expand the Home search to include fuzzy matching or vector search if inventory grows large.
4.  **Multi-User / Sharing**: Add "Household" sharing where multiple users can manage the same set of containers.

## How to Continue
- `npm run dev`: Start local development.
- `npx vite build`: Production build (test PWA service worker).
- **Git Branch**: `main` is current and pushed to `origin`.
