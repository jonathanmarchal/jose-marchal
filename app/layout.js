import './globals.css';
import ScrollReveal from './components/ScrollReveal';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://josemarchal.nl'),
  title: {
    default: 'José Marchal Donkersloot',
    template: '%s — José Marchal Donkersloot'
  },
  description: 'José Marchal Donkersloot — dirigente & alt',
  icons: {
    icon: [
      { url: '/favicon-light.svg', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-dark.svg', media: '(prefers-color-scheme: dark)' },
      { url: '/favicon.svg' }
    ]
  },
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
      <body>{children}<ScrollReveal /></body>
    </html>
  );
}
