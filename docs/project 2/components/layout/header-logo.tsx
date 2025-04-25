import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export function HeaderLogo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary">
        <Sparkles className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="font-semibold text-xl">PromptVault</span>
    </Link>
  );
}