import Image from 'next/image';
import Link from 'next/link';
import { getConcerts, formatDate } from '../lib/notion';

export const revalidate = 300;

export default async function Home() {
  const concerts = await getConcerts();

  return (
    <main>
      <section className="hero">
        <Image src="/assets/Background_josemarchal.png" alt="Achtergrond kerk" fill priority className="heroBackground" />
        <div className="tickerLayer" aria-hidden="true">
          <div className="tickerTrack">
            <span>José Marchal Donkersloot — </span>
            <span>José Marchal Donkersloot — </span>
            <span>José Marchal Donkersloot — </span>
            <span>José Marchal Donkersloot — </span>
          </div>
        </div>
        <Image src="/assets/foreground_josemarchal.png" alt="José Marchal-Donkersloot" width={520} height={780} priority className="heroPerson" />
        <div className="heroLabel parallaxLabel">
          <Image src="/assets/arrow-down-left.png" alt="" width={34} height={34} className="heroLabelArrow" />
          <span>DIRIGENTE &<br />ALT</span>
        </div>
      </section>

      <section className="concerts" id="concerten">
        <h1 className="sectionTitle">Concerten</h1>
        <div className="concertList">
          {concerts.length > 0 ? concerts.map((concert) => (
            <Link href={`/concert/${concert.slug}`} className="concertItem" key={concert.id}>
              <div>
                <p className="ensemble">{concert.ensemble}</p>
                <h2>{concert.title}</h2>
              </div>
              <div className="concertMeta">
                <span>{formatDate(concert.date)} {concert.time ? `| ${concert.time}` : ''}</span>
                <span className="concertArrow">↗</span>
              </div>
            </Link>
          )) : (
            <p className="emptyState">Concerten konden niet worden geladen.</p>
          )}
        </div>
      </section>

      <section className="bio" id="biografie">
        <div className="bioText">
          <h2>Biografie</h2>
          <p>José Marchal-Donkersloot volgde koordirectievakken op Hogeschool Bourdon. In 2019 is ze begonnen met koordirectie aan het Rotterdams conservatorium bij Wiecher Mandemaker.</p>
          <p>Samen met Rien Donkersloot richtte ze Capella Laurentius op, een ambitieus dubbelkwartet. Daarnaast is José actief als dirigent en zanger in kleinere bezettingen.</p>
        </div>
        <div className="bioImages">
          <Image src="/assets/Biography_V1.png" alt="José dirigeert" width={320} height={420} />
          <Image src="/assets/Biography_V2.png" alt="José portret" width={320} height={420} />
        </div>
      </section>
    </main>
  );
}
