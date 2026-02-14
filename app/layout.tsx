import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alstom RCIS',
  description: 'PM ESD Line Rework Intelligence System'
};

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/rework-entry', label: 'Rework Entry' },
  { href: '/actions', label: 'Corrective Actions' },
  { href: '/knowledge', label: 'Knowledge Bank' }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-base via-slate-900 to-panel">
          <header className="border-b border-slate-700 bg-slate-950/60 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <div>
                <h1 className="text-xl font-bold text-white">Alstom RCIS</h1>
                <p className="text-xs text-slate-300">Power Module ESD Line Rework Intelligence System</p>
              </div>
              <nav className="flex gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-accent hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-7xl p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
