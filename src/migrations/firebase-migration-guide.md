
# Firebase Migration Guide for MakerBrains.com

## Overview
This guide provides step-by-step instructions to migrate from Supabase to Firebase.

## Prerequisites
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database
3. Enable Authentication (Email/Password and Google OAuth)
4. Install Firebase CLI: `npm install -g firebase-tools`

## Step 1: Install Firebase Dependencies
```bash
npm install firebase
npm install --save-dev @types/firebase
```

## Step 2: Firebase Configuration
Create `src/config/firebase.ts` with your Firebase config

## Step 3: Data Migration Plan

### Current Supabase Schema:
- `projects` table: id, title, description, content, image, url, author, date
- `achievements` table: id, title, icon, link, year
- `magazines` table: id, title, image_url, website_url
- `sponsors` table: id, name, image_url, website_url
- `recognitions` table: id, title, link, year, month, day

### Firebase Firestore Collections:
- `projects` collection
- `achievements` collection
- `magazines` collection
- `sponsors` collection
- `recognitions` collection
- `users` collection (for authentication)

## Step 4: Export Data from Supabase
Run the migration script to export data from Supabase and prepare for Firebase import.

## Step 5: Authentication Migration
- Set up Firebase Authentication
- Users will need to re-register or use password reset
- Implement Google OAuth as additional option

## Step 6: Update Application Code
- Replace Supabase client with Firebase client
- Update all data fetching logic
- Update authentication logic

## Migration Timeline
1. Set up Firebase project (Day 1)
2. Export Supabase data (Day 1)
3. Import data to Firebase (Day 2)
4. Update authentication (Day 2-3)
5. Update application code (Day 3-4)
6. Testing and deployment (Day 5)

## Rollback Plan
- Keep Supabase project active during migration
- Create feature flags to switch between backends
- Full testing before final cutover
