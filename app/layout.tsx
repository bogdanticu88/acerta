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
    'Vendor security due diligence platform aligned to GDPR, NIS2 and DORA. CIA-based risk tiering with automated OSINT vetting.',
  keywords: 'vendor due diligence, GDPR, NIS2, DORA, third-party risk, OSINT, security assessment',
  openGraph: {
    title: 'Acerta — EU Vendor Security Due Diligence',
    description: 'CIA-based risk tiering. OSINT-backed verification. Aligned to GDPR, NIS2 and DORA.',
    images: [{ url: '/acerta/logo.png', width: 1024, height: 1024, alt: 'Acerta' }],
  },
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
