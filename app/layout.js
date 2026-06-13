import './globals.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://josemarchal.nl'),
  title: {
    default: 'José Marchal Donkersloot',
    template: '%s — José Marchal Donkersloot'
  },
  description: 'José Marchal Donkersloot — dirigente & alt',
  openGraph: {
    title: 'José Marchal Donkersloot',
    description: 'José Marchal Donkersloot — dirigente & alt',
    type: 'website',
    locale: 'nl_NL'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
