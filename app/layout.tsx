import { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import { Toaster } from "sonner";

import { Navbar } from "@/components/custom/navbar";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { VisualModeProvider } from "@/components/custom/visual-mode-context";

import "./globals.css";
// Import custom CSS files
import "./fullscreen.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://promptmack.com"),
  title: "Promptmack",
  description: "An adaptive AI agent that performs tasks and actions online for users",
  manifest: "/manifest.json",
  themeColor: "#4f46e5",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Promptmack",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
  formatDetection: {
    telephone: false,
  },
  applicationName: "Promptmack",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* PWA specific meta tags */}
        <meta name="application-name" content="Promptmack" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Promptmack" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Keyboard behavior for mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="keyboard-scroll-fix" content="true" />
        
        {/* Android fullscreen mode */}
        <meta name="theme-color" content="#4f46e5" />
        <meta name="full-screen" content="yes" />
        <meta name="browsermode" content="application" />
        <meta name="screen-orientation" content="portrait" />
        <meta name="x5-orientation" content="portrait" />
        <meta name="x5-fullscreen" content="true" />
        <meta name="x5-page-mode" content="app" />
        
        {/* Microsoft specific */}
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* PWA icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-152x152.png" />
        
        {/* PWA splash screens for iOS */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />
        
        {/* Register service worker */}
        <script src="/register-sw.js" defer />
        
        {/* Fullscreen mode enforcement */}
        <script src="/fullscreen.js" defer />
        
        {/* Mobile keyboard fix */}
        <script src="/keyboard-fix.js" defer />
        
        {/* PWA checker in development mode */}
        {isDevelopment && <script src="/pwa-check.js" defer />}
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <VisualModeProvider>
            <Toaster position="top-center" />
            <Navbar />
            {children}
          </VisualModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
