import Link from 'next/link';
import { HeaderLogo } from './header-logo';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex flex-col items-center md:items-start gap-2">
          <HeaderLogo />
          <p className="text-sm text-muted-foreground">
            The largest and best prompt library known to mankind.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </div>
        <div className="text-sm text-muted-foreground">
          © 2025 PromptVault. All rights reserved.
        </div>
      </div>
    </footer>
  );
}