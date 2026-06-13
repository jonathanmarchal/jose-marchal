import HeroLabel from './HeroLabel';

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero-bg" src="/assets/Background_josemarchal.png" alt="Interieur van een kerk met warme verlichting" />

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          <span>José Marchal Donkersloot —</span>
          <span>José Marchal Donkersloot —</span>
          <span>José Marchal Donkersloot —</span>
          <span>José Marchal Donkersloot —</span>
        </div>
      </div>

      <img className="hero-person" src="/assets/foreground_josemarchal.png" alt="Portret van José Marchal Donkersloot" />
      <HeroLabel />

      <h1 id="hero-title" className="sr-only">José Marchal Donkersloot</h1>
    </section>
  );
}
