# José Marchal Donkersloot — Next.js + Notion + HTML design

Deze versie gebruikt de HTML/CSS-compositie van het design, maar draait als Next.js-site zodat Notion, automatische detailpagina's en SEO per concert blijven werken.

## Structuur

```text
app/
  page.js                 Homepagina met hero, concerten en biografie
  concert/[slug]/page.js  Automatische detailpagina per concert
  api/concerts/route.js   Test-endpoint met concertdata
lib/notion.js             Notion koppeling + fallback data
data/concerts.json        Fallback voor lokale preview
public/assets/            Afbeeldingen uit het design
```

## Notion database

Maak een database `Concerten` met deze properties:

| Property | Type | Verplicht |
| --- | --- | --- |
| Titel | Title | Ja |
| Datum | Date | Ja |
| Tijd | Text | Nee |
| Starttijd | Text | Nee |
| Eindtijd | Text | Nee |
| Ensemble | Text | Nee |
| Locatie | Text | Nee |
| Plaats | Text | Nee |
| Beschrijving | Text | Nee |
| Ticket URL | URL | Nee |
| Afbeelding | Files & media | Nee |
| Slug | Text | Nee |
| Gepubliceerd | Checkbox | Nee |

`Tijd` is het veld dat in het overzicht en op de detailpagina wordt getoond, bijvoorbeeld `14:30 – 17:00`. De oudere velden `Starttijd` en `Eindtijd` blijven als fallback werken.

`Slug` bepaalt de URL, bijvoorbeeld `/concert/bachconcert-dordrecht`. Als Slug leeg is, maakt de site automatisch een slug op basis van titel, plaats en datum.

## Notion integration

1. Ga naar `https://www.notion.so/my-integrations`.
2. Maak een integration, bijvoorbeeld `José Website`.
3. Kopieer de `Internal Integration Secret`.
4. Open de database als volledige pagina.
5. Klik rechtsboven op `...` → `Connections` / `Add connections`.
6. Voeg `José Website` toe.

## Vercel environment variables

Ga in Vercel naar je project → `Settings` → `Environment Variables` en voeg toe:

```env
NOTION_TOKEN=secret_of_ntn_token_hier
NOTION_DATABASE_ID=database_id_hier
NEXT_PUBLIC_SITE_URL=https://josemarchal.nl
```

Zet ze aan voor Production en Preview. Doe daarna een nieuwe deployment.

## Lokaal draaien

```bash
npm install
npm run dev
```

Open daarna `http://localhost:3000`.

Zonder Notion variables gebruikt de site automatisch `data/concerts.json`, zodat je het design lokaal direct kunt bekijken.

## Testen

Na deployment kun je testen via:

```text
https://jouw-site.vercel.app/api/concerts
```

Als Notion goed gekoppeld is, zie je je concerten als JSON terug.


## Concertarchief

De homepage toont alleen aankomende concerten. Een concert blijft op de homepage staan tot en met de concertdatum. Vanaf de volgende dag verhuist het automatisch naar:

```text
/archief
```

De detailpagina van een verlopen concert blijft gewoon werken via:

```text
/concert/jouw-slug
```

Je hoeft hiervoor niets extra's in Notion te doen. De site kijkt naar de property `Datum` en vergelijkt die met de huidige datum in Nederland.


## 8. Archief

De homepage toont alleen aankomende concerten. De website gebruikt de datum in het Notion-veld `Datum` en vergelijkt die met de huidige datum in de Nederlandse tijdzone (`Europe/Amsterdam`).

- Concertdatum vandaag of later: zichtbaar op de homepage.
- Concertdatum vóór vandaag: zichtbaar op `/archief`.

Voorbeeld: als het vandaag 13 juni is, gaat een concert van 12 juni automatisch naar `/archief`.

## 9. Animaties en favicon

Deze versie bevat:

- Favicon met de initialen `JMD`, met lichte en donkere variant.
- Subtiele animatie bij de hero-label `Dirigente & Alt`.
- Smooth fade-in on scroll voor concerten, biografie en detailblokken.
