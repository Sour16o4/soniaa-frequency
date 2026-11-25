import './globals.css';

// Fonts load in the browser from Google Fonts. next/font fetched them at build time,
// which failed intermittently and would break deploys.
const FONTS = 'https://fonts.googleapis.com/css2?family=Major+Mono+Display&family=Manrope:wght@400;500;600;800&family=VT323&display=swap';

export const metadata = {
  title: 'Soniaa S. — Frequency',
  description: 'Most marketing is noise. Tune in to Soniaa S., Fractional CMO.',
  appleWebApp: { capable: true, title: 'Frequency', statusBarStyle: 'default' },
};
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#d8d4cb' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>{children}</body>
    </html>
  );
}
