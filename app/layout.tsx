import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Acerta — EU Vendor Security Due Diligence',
  description:
    'State-of-the-art vendor security due diligence platform aligned to GDPR, NIS2 & DORA. CIA-based risk tiering with automated OSINT vetting.',
  keywords: 'vendor due diligence, GDPR, NIS2, DORA, third-party risk, OSINT, security assessment',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
