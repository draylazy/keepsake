# Keepsake

Keepsake is a beautiful, highly-customizable React web app for creating and sharing personal photo albums. Users can handpick photos, arrange them into gorgeous layouts (Scrapbook, Storybook, Gallery Wall, or Album Book), fully customize the colors and fonts, and share a secure, magical link with their loved ones.

It is cleverly designed to run entirely on the **Firebase Spark (Free) plan**, utilizing Firestore for storage and sidestepping the need for paid cloud storage by efficiently compressing images locally and saving them as Base64 strings.

## Features

- **Four Premium Layouts:** Choose from carefully crafted layouts (Scrapbook, Storybook, Gallery Wall, and Album Book) built with responsive Flexbox/Grid systems that look great on any device.
- **Full Customization Engine:** Personalize your album by changing the Frame Color, Background Color, Font Color, and Font Family to perfectly match the mood of your photos.
- **Individual Photo Notes:** Add cute, 20-character handwritten labels to individual photos that stick right to the frames.
- **Automatic Light/Dark Mode:** The app seamlessly adapts to your system preferences, complete with a persistent manual sun/moon toggle switch in the corner.
- **Image Downloading (html2canvas):** Viewers can magically capture and download the entire album layout as a perfectly balanced, high-resolution PNG image!
- **Mobile-First Sharing:** Image downloading intelligently taps into the native Web Share API on iOS/Android, allowing users to effortlessly save or share albums directly to their camera rolls.
- **Zero-setup Local Mode:** If Firebase credentials are not provided, the app falls back to IndexedDB seamlessly so you can test it locally without an internet connection.

## Important Note on Limits

Because photos are compressed and stored directly inside Firestore documents (to stay within free-tier limits), **each album is limited to a maximum of 15 photos.** The client actively enforces this limit during selection, resizing each image down to ~200KB before uploading.

## Firebase Setup (Free Spark Plan)

To deploy your own Keepsake with a cloud backend, follow these steps:

1. **Create a Project**
   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

2. **Register a Web App**
   Click the Web (`</>`) icon, name the app, and copy the `firebaseConfig` variables into a new `.env` file at the root of this project (use `.env.example` as a template).

3. **Enable Anonymous Authentication**
   Go to **Authentication** -> **Sign-in method**. Add **Anonymous** as a provider and enable it.

4. **Create Firestore Database**
   Go to **Firestore Database**, click **Create database** (Production mode), and choose a nearby location.

5. **Deploy Firestore Rules**
   Go to the **Rules** tab in your Firestore database. Copy the contents of `firestore.rules` from this repository and publish them.

## Local Development

```bash
npm install
npm run dev
```

If you haven't set up Firebase keys, the app will show a small warning banner and use `IndexedDB` under the hood. All links will only work locally within your browser.

## Deployment

### Vercel / Netlify
Keepsake is a standard Vite React SPA. 
- Build command: `npm run build`
- Publish directory: `dist`
- Remember to add your `VITE_FIREBASE_*` environment variables in your hosting provider's dashboard!

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Choose your project
# Public directory: dist
# Configure as a single-page app: Yes
npm run build
firebase deploy --only hosting
```
