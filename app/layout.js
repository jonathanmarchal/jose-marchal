import './globals.css';

export const metadata = {
  title: 'José Marchal-Donkersloot',
  description: 'Dirigente en zanger José Marchal-Donkersloot'
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
