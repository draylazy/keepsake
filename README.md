# Keepsake

Keepsake is a React web app for creating and sharing beautiful photo albums. Users can choose photos, select a photo album style (Scrapbook, Storybook, Film strip, Gallery wall), and share a secure link with their loved ones.

It is designed to run entirely on the **Firebase Spark (Free) plan**, utilizing Firestore for storage and circumventing the need for Firebase Cloud Storage (which requires a paid plan) by aggressively compressing images locally and storing them as Base64 strings.

## Features
- **Client-side compression:** Uses HTML5 Canvas to resize and compress JPEG images until they are well under ~200KB each.
- **Batched Firestore writes:** Ensures atomic creation of the album and its up to 15 photos without hitting the 1MiB per document limit.
- **Zero-setup Local Mode:** If Firebase credentials are not provided, the app falls back to IndexedDB seamlessly so you can test it locally.
- **Five unique themes** designed carefully using raw CSS, CSS Variables, and responsive design.

## Important Note on Limits
Because photos are compressed and stored as strings directly inside Firestore documents (to stay on the free plan), **each album is limited to a maximum of 15 photos.** The client actively enforces this limit during selection and compression.

## Firebase Setup (Free Spark Plan)

To deploy your own Keepsake with a cloud backend, follow these exact steps:

1. **Create a Project**
   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project. You can turn off Google Analytics for this project.

2. **Register a Web App**
   Click the Web (`</>`) icon. Name the app. You don't need Firebase Hosting checked just yet. 
   Copy the `firebaseConfig` variables provided into a new `.env` file at the root of this project (use `.env.example` as a template).

3. **Enable Anonymous Authentication**
   Go to **Authentication** -> **Sign-in method**.
   Click "Add new provider", select **Anonymous**, enable it, and save.

4. **Create Firestore Database**
   Go to **Firestore Database** and click **Create database**.
   Choose **Production mode** (we will supply our own secure rules). Choose a location close to you.

5. **Deploy Firestore Rules**
   Go to the **Rules** tab in your Firestore database.
   Copy the contents of `firestore.rules` from this repository and paste them into the editor. Click **Publish**.

## Local Development

\`\`\`bash
npm install
npm run dev
\`\`\`

If you haven't set up Firebase keys, the app will show a small banner and use `IndexedDB`. All links will only work locally within your browser.

## Deployment

### Vercel / Netlify
Keepsake is a standard Vite React SPA. 
- Build command: `npm run build`
- Publish directory: `dist`
- Remember to add your `VITE_FIREBASE_*` environment variables in your hosting provider's dashboard!

### Firebase Hosting
\`\`\`bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Choose your project
# Public directory: dist
# Configure as a single-page app: Yes
npm run build
firebase deploy --only hosting
\`\`\`
