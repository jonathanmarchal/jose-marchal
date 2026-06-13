import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="detail-page">
      <Link className="back-link" href="/">← Terug naar home</Link>
      <article className="concert-detail">
        <p className="concert-meta">404</p>
        <h1>Pagina niet gevonden</h1>
        <p className="detail-description">Deze pagina bestaat niet of is niet meer gepubliceerd.</p>
      </article>
    </main>
  );
}
