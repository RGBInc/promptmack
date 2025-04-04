import { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import { Toaster } from "sonner";

import { Navbar } from "@/components/custom/navbar";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { VisualModeProvider } from "@/components/custom/visual-mode-context";

import "./globals.css";

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
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
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
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#4f46e5" />
        
        {/* PWA icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-152x152.png" />
        
        {/* PWA splash screens for iOS */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />
        
        {/* Register service worker */}
        <script src="/register-sw.js" defer />
        
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
