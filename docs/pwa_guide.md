# Promptmack PWA Guide

This guide explains the Progressive Web App (PWA) features of Promptmack, how to use them, and how to test them.

## What is a PWA?

A Progressive Web App (PWA) is a type of application software delivered through the web, built using common web technologies including HTML, CSS, and JavaScript. It provides a user experience similar to native apps on desktop and mobile devices.

Promptmack has been configured as a PWA, which means:

1. **Installability**: Users can add Promptmack to their home screen or desktop
2. **Offline support**: Basic functionality works even without an internet connection
3. **Fast loading**: Caching strategies improve load times on repeat visits
4. **Native-like features**: Full-screen experience without browser UI

## PWA Features in Promptmack

### 1. Installation

Promptmack can be installed on:

- **Desktop devices** (Windows, macOS, Linux):
  - Chrome, Edge: Look for the install icon (➕) in the address bar
  - Firefox: Click the three dots (⋯) in the address bar, then "Install site as app"

- **Mobile devices** (iOS, Android):
  - iOS (Safari): Tap the share button, then "Add to Home Screen"
  - Android (Chrome): Tap the three dots (⋮), then "Add to Home Screen"

### 2. Offline Support

Promptmack provides limited functionality when offline:

- Cached assets and pages will load
- A dedicated offline page appears when connectivity is lost
- When connection is restored, the app will automatically reconnect

### 3. App-like Experience

When installed, Promptmack provides:

- Full-screen experience without browser UI
- Fast app-like transitions between pages
- Custom splash screen on iOS devices
- Custom app icon on your home screen/desktop

## Implementation Details

### Core PWA Components

1. **Web Manifest (`manifest.json`)**:
   - Defines app name, icons, colors, and behavior
   - Controls how the app appears when installed

2. **Service Worker (`sw.js`)**:
   - Manages caching and offline capabilities
   - Handles background synchronization
   - Provides offline fallback experience

3. **App Icons**:
   - Multiple sizes for different devices and contexts
   - Optimized for iOS and Android platforms

### How It Works

1. **First Visit**:
   - Service worker registers and caches critical resources
   - Web manifest becomes available to the browser

2. **Installation**:
   - Browser recognizes installability based on manifest and service worker
   - Installation prompt may appear (varies by browser)

3. **Offline Usage**:
   - Service worker intercepts network requests
   - Returns cached resources when possible
   - Shows offline fallback page when necessary

## Testing PWA Features

### Installation Testing

1. **Desktop (Chrome)**:
   - Open Promptmack in Chrome
   - Look for the install button (➕) in the URL bar
   - If not visible, try clearing site data and reloading

2. **Mobile (Android)**:
   - Open Promptmack in Chrome
   - A "Add to Home Screen" banner may appear automatically
   - Or tap the menu button and select "Add to Home Screen"

3. **iOS (Safari)**:
   - Open Promptmack in Safari
   - Tap the share button
   - Select "Add to Home Screen"

### Offline Testing

1. Enable airplane mode or disable your network connection
2. Reload Promptmack
3. You should see the offline fallback page
4. Re-enable your connection
5. The app should reconnect automatically

### Lighthouse Testing

You can use Google Chrome's Lighthouse tool to test PWA compliance:

1. Open Promptmack in Chrome
2. Press F12 to open DevTools
3. Navigate to the "Lighthouse" tab
4. Select "Progressive Web App" category
5. Click "Generate report"

## PWA Debugging

For developers, Promptmack includes a PWA checker tool in development mode:

1. Run the app in development mode
2. Open the browser console (F12)
3. Look for the "Promptmack PWA Status Check" output
4. This shows PWA compliance and readiness status

### Common Issues

1. **Installation prompt doesn't appear**:
   - Check if the app is already installed
   - Ensure you're using a supported browser
   - Verify the manifest.json is accessible

2. **Offline mode not working**:
   - Clear site data and cache
   - Reload the page to ensure service worker activation
   - Check browser console for service worker errors

3. **PWA not updating**:
   - Service workers may serve cached versions
   - Force reload (Shift+F5) to get the latest version

## Future PWA Enhancements

Planned improvements to Promptmack's PWA capabilities:

1. **Background sync**: Queue actions when offline to execute when connection returns
2. **Push notifications**: Alert users about important events
3. **Improved caching**: More sophisticated strategies for different resource types
4. **App shortcuts**: Quick access to common features from the app icon
5. **Share target**: Register as a share target for receiving content from other apps

## Feedback

We're continuously improving Promptmack's PWA experience. If you encounter any issues or have suggestions, please submit them through the GitHub repository.

---

For technical details on how the PWA is implemented, developers can refer to the source code in:
- `/public/manifest.json`
- `/public/sw.js`
- `/public/register-sw.js`
- `/app/layout.tsx` 