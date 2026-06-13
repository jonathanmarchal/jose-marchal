import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getConcertBySlug, getConcerts, formatDate } from '../../../lib/notion';

export const revalidate = 300;

export async function generateStaticParams() {
  const concerts = await getConcerts();
  return concerts.map((concert) => ({ slug: concert.slug }));
}

export async function generateMetadata({ params }) {
  const concert = await getConcertBySlug(params.slug);
  if (!concert) return {};
  return {
    title: `${concert.title} | José Marchal-Donkersloot`,
    description: concert.description
  };
}

export default async function ConcertDetail({ params }) {
  const concert = await getConcertBySlug(params.slug);
  if (!concert) notFound();

  return (
    <main className="detailPage">
      <Link href="/" className="backLink">← Terug naar overzicht</Link>
      <section className="detailHero">
        <Image src={concert.imageUrl} alt="Concertbeeld" fill className="detailImage" />
        <div className="detailOverlay">
          <p className="ensemble">{concert.ensemble}</p>
          <h1>{concert.title}</h1>
        </div>
      </section>

      <section className="detailContent">
        <div className="detailMeta">
          <p><strong>Datum</strong><br />{formatDate(concert.date)}</p>
          {concert.time && <p><strong>Tijd</strong><br />{concert.time}</p>}
          {concert.location && <p><strong>Locatie</strong><br />{concert.location}</p>}
        </div>
        <div className="detailText">
          <p>{concert.description}</p>
          {concert.ticketUrl && <a className="ticketButton" href={concert.ticketUrl}>Tickets / meer info ↗</a>}
        </div>
      </section>
    </main>
  );
}
