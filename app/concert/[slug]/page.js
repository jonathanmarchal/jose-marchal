import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDateLong, formatTimeRange, getConcertBySlug, getConcerts } from '@/lib/notion';

export const revalidate = 60;

export async function generateStaticParams() {
  const concerts = await getConcerts();
  return concerts.map((concert) => ({ slug: concert.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const concert = await getConcertBySlug(slug);
  if (!concert) return { title: 'Concert niet gevonden' };

  const location = [concert.venue, concert.city].filter(Boolean).join(', ');
  const description = concert.description || [formatDateLong(concert.date), location].filter(Boolean).join(' — ');

  return {
    title: concert.title,
    description,
    openGraph: {
      title: `${concert.title} — José Marchal Donkersloot`,
      description,
      type: 'article',
      images: concert.image ? [{ url: concert.image }] : undefined
    }
  };
}

export default async function ConcertPage({ params }) {
  const { slug } = await params;
  const concert = await getConcertBySlug(slug);
  if (!concert) notFound();

  const timeRange = formatTimeRange(concert);
  const location = [concert.venue, concert.city].filter(Boolean).join(', ');

  return (
    <main className="detail-page">
      <Link className="back-link" href="/#concerten">← Terug naar concerten</Link>
      <article className="concert-detail reveal" aria-live="polite">
        <p className="concert-meta">{concert.ensemble}</p>
        <h1>{concert.title}</h1>
        <dl className="detail-meta">
          <div><dt>Datum</dt><dd>{formatDateLong(concert.date)}</dd></div>
          {timeRange ? <div><dt>Tijd</dt><dd>{timeRange}</dd></div> : null}
          {location ? <div><dt>Locatie</dt><dd>{location}</dd></div> : null}
        </dl>
        {concert.description ? <p className="detail-description">{concert.description}</p> : null}
        {concert.ticketUrl ? <a className="detail-button" href={concert.ticketUrl} target="_blank" rel="noreferrer">Tickets / meer informatie</a> : null}
      </article>
    </main>
  );
}
