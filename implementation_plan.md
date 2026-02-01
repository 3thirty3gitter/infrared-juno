# Project Implementation Plan: Smart Storage QR App (Web/PWA)

**Project Name:** SmartStorage (TBD)
**Goal:** A mobile-first Progressive Web Application (PWA) for managing storage tubs via QR codes.
**Target Audience:** Homeowners, Android/iOS users (Cross-platform coverage via Web).

## 1. Technology Stack
*   **Frontend Framework:** Vite + React (Fast, lightweight, PWA-ready).
*   **Language:** JavaScript (ES6+).
*   **Styling:** Vanilla CSS (CSS Variables, Flexbox/Grid) with a premium "Glassmorphism" aesthetic.
*   **Database & Auth:** Supabase (PostgreSQL, Authentication, Real-time).
*   **Storage:** Supabase Storage (For item photos).
*   **Hosting:** Vercel.

> **Note on Platform:** While the original discussion mentioned Kotlin (Native Android), using Antigravity and Vercel implies a Web Application. We will build this as a high-performance **PWA** that can be installed on Android/iOS homescreens and access native features like Camera and Voice.

## 2. Core Features
1.  **User Authentication:** Sign up/Login (Supabase Auth).
2.  **Dashboard/Home:** Overview of storage stats, quick search, and "Scan" FAB (Floating Action Button).
3.  **Tub Management:**
    *   Create new Tub (Name, Description, Location, Color/Icon).
    *   Generate and View QR Code for Tub.
    *   **Print Mode:** Generate a printable sheet of QR codes.
4.  **Item Management:**
    *   Add Item to Tub.
    *   Capture Photo (Camera integration).
    *   Voice Note / Text Description.
    *   Tags/Categories (e.g., "Christmas", "Tools").
5.  **QR Scanner:**
    *   Integrated camera scanner.
    *   Lookup Tub by QR scan.
6.  **Search & Voice:**
    *   Text search using Supabase full-text search.
    *   Voice command integration ("Where is my...").

## 3. Data Structure (Supabase Schema)
*   **tables:**
    *   `profiles`: User data (id, email).
    *   `tubs`: (id, user_id, name, description, location_id, created_at).
    *   `items`: (id, tub_id, name, description, image_url, tags[], created_at).
    *   `locations`: (id, user_id, name, type).

## 4. Design Aesthetics (Premium Glassmorphism)
*   **Theme:** Dark mode by default (modern/sleek).
*   **Colors:** Deep indigo/violet background gradients, semi-transparent glass cards (backdrop-filter: blur).
*   **Typography:** 'Inter' or 'Outfit' (Google Fonts) for clean readability.
*   **Interactions:** Smooth transitions between pages, micro-animations on buttons.

## 5. Implementation Steps

### Phase 1: Foundation & Setup
- [x] Initialize Vite Project (React).
- [ ] Setup Global CSS Variables & Typography.
- [ ] Install dependencies (`react-router-dom`, `lucide-react`, `html5-qrcode`).
- [ ] Create core UI components (GlassCard, Button, FAB, Navbar).

### Phase 2: Supabase Integration
- [x] Setup Supabase Client.
- [x] Create Authentication Context (Login/Signup flows).
- [x] Design Database Schema SQL script.

### Phase 3: Core Functionality (The "Tub" Logic)
- [x] Build "My Tubs" list view.
- [x] Build "Create Tub" form.
- [x] Implement QR Code generation (using `qrcode` lib).
- [x] Build "Tub Details" view (List of items).
- [x] Implement Delete Tubs and Items functionality.

### Phase 4: Camera & Interactions
- [x] Implement Camera interface for Item photos.
- [x] Upload logic to Supabase Storage.
- [x] Implement QR Code Scanner.

### Phase 5: Search & Voice
- [x] Search Bar with tag filtering. (Basic search implemented across Home and TubsList)
- [x] Web Speech API integration for "Voice Search".

### Phase 6: Polish & PWA
- [x] Add Service Worker for offline capability/installability. (Implemented via vite-plugin-pwa)
- [x] Generate app icons/manifest.json. (PWA Manifest created with icons)
- [x] Final UI/UX Polish (animations, loading states).
- [x] Printable PDF generation for QR labels.

### Phase 7: Enhancements (As Requested)
- [x] **Item Reminders**: Add expiry/rotation dates to items. (Expiring Items Dashboard added to Home)
- [x] **Tags System**: UI for adding/filtering by tags. (Tag Manager and Search implemented)
- [ ] **Home Assistant / Voice**: Enhance voice search to handle questions ("Where is...?").
- [x] **Data Backup**: Export inventory to CSV/JSON. (Full Import/Export JSON support)
