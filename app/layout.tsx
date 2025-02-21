import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import { Navbar } from "@/components/custom/navbar";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { VisualModeProvider } from "@/components/custom/visual-mode-context";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://promptmack.com"),
  title: "Promptmack",
  description: "Promptmack",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
