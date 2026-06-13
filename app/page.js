import Hero from './components/Hero';
import ConcertList from './components/ConcertList';
import { getConcerts } from '@/lib/notion';

export const revalidate = 60;

export default async function HomePage() {
  const concerts = await getConcerts();

  return (
    <main id="top">
      <Hero />

      <section id="concerten" className="concerts" aria-labelledby="concerts-title">
        <h2 id="concerts-title" className="section-title">Concerten</h2>
        <div className="concert-list" aria-live="polite">
          <ConcertList concerts={concerts} />
        </div>
      </section>

      <section id="biografie" className="bio" aria-labelledby="bio-title">
        <div className="bio-copy">
          <h2 id="bio-title">Biografie</h2>
          <p>José Marchal-Donkersloot volgde koordirectievakken op Hogeschool Bourdon. In 2019 is ze begonnen met koordirectie aan het Rotterdams conservatorium (Codarts) bij Wiecher Mandemaker.</p>
          <p>José is repetitor van Koorschool Ars Musica, dirigent van Kamerkoor Cantus uit Gouda en dirigent van Gemengd koor Preludium te Woerden.</p>
          <p>Samen met Rien Donkersloot richtte ze Capella Laurentius op, een ambitieus dubbelkwartet. Daarnaast is José actief als zanger in kleinere bezettingen en als (alt) solist.</p>
        </div>
        <div className="bio-images" aria-hidden="true">
          <img className="bio-img bio-img-one" src="/assets/Biography_V1.png" alt="" />
          <img className="bio-img bio-img-two" src="/assets/Biography_V2.png" alt="" />
        </div>
      </section>
    </main>
  );
}
