import Link from 'next/link';
import ConcertList from '../components/ConcertList';
import { getArchivedConcerts, getConcerts } from '@/lib/notion';

export const revalidate = 60;

export const metadata = {
  title: 'Concertarchief',
  description: 'Archief van eerdere concerten van José Marchal Donkersloot'
};

export default async function ArchivePage() {
  const concerts = getArchivedConcerts(await getConcerts());

  return (
    <main className="archive-page">
      <Link className="back-link" href="/#concerten">← Terug naar concerten</Link>
      <section className="concerts archive-concerts" aria-labelledby="archive-title">
        <h1 id="archive-title" className="section-title">Concertarchief</h1>
        <p className="archive-intro">Eerdere concerten worden automatisch hier geplaatst zodra de concertdatum voorbij is.</p>
        <div className="concert-list" aria-live="polite">
          <ConcertList concerts={concerts} emptyMessage="Er staan nog geen eerdere concerten in het archief." />
        </div>
      </section>
    </main>
  );
}
