# José Marchal-Donkersloot — Next.js + Notion

Deze versie gebruikt:

- Next.js
- Notion als CMS voor concerten
- Vercel als hosting
- Google Fonts: Brygada 1918 en Albert Sans
- Dynamische concert-overzichtspagina op `/`
- Dynamische concert-detailpagina's op `/concert/[slug]`

Als de Notion variabelen nog niet zijn ingevuld, toont de site demo-concerten. Zo kun je eerst lokaal of op Vercel testen.

---

## 1. Notion database maken

Maak in Notion een nieuwe pagina, bijvoorbeeld:

`José Marchal Website`

Maak daarin een database als volledige pagina met de naam:

`Concerten`

Maak deze properties exact zo aan:

| Property | Type | Verplicht |
|---|---|---|
| Titel | Title | ja |
| Datum | Date | ja |
| Tijd | Text | nee |
| Locatie | Text | nee |
| Ensemble | Text | nee |
| Beschrijving | Text | nee |
| Ticket URL | URL | nee |
| Hero Afbeelding | Files & media | nee |
| Slug | Text | ja |
| Gepubliceerd | Checkbox | ja |

Let op: de namen zijn hoofdlettergevoelig in de code. Gebruik dus bijvoorbeeld `Ticket URL`, niet `Ticket link`.

### Voorbeeldrecord

Titel:

`Bachconcert Dordrecht`

Datum:

`9 november 2025`

Tijd:

`14:30 – 17:00`

Locatie:

`Dordrecht`

Ensemble:

`Laurens Kamerkoor`

Beschrijving:

`José Marchal-Donkersloot dirigeert een concertprogramma met werken van Johann Sebastian Bach.`

Ticket URL:

`https://voorbeeld.nl/tickets`

Slug:

`bachconcert-dordrecht`

Gepubliceerd:

aanvinken

De URL wordt dan:

`/concert/bachconcert-dordrecht`

---

## 2. Notion integration maken

1. Ga naar `https://www.notion.so/my-integrations`
2. Klik op `New integration`
3. Naam: `José Website`
4. Kies je workspace
5. Klik op `Submit` of `Save`
6. Kopieer de `Internal Integration Secret`

Die ziet er ongeveer zo uit:

`secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

Deze waarde heb je straks nodig als `NOTION_TOKEN`.

---

## 3. Notion database delen met de integration

Dit is een stap die vaak wordt vergeten.

1. Open je Notion database `Concerten`
2. Klik rechtsboven op de drie puntjes `...`
3. Kies `Connections`
4. Zoek `José Website`
5. Voeg deze connection toe

Zonder deze stap krijgt de website geen toegang tot de database.

---

## 4. Database ID ophalen

Open de Notion database als volledige pagina. De URL lijkt ongeveer op:

`https://www.notion.so/jouwnaam/1234567890abcdef1234567890abcdef?v=...`

Het stuk van 32 tekens is je database ID:

`1234567890abcdef1234567890abcdef`

Soms staan er streepjes in. Beide vormen werken meestal, maar gebruik bij voorkeur alleen de 32 tekens zonder `?v=...` erachter.

Deze waarde heb je straks nodig als `NOTION_DATABASE_ID`.

---

## 5. Lokaal testen

Installeer dependencies:

```bash
npm install
```

Maak een bestand `.env.local` aan in de root van het project:

```env
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=1234567890abcdef1234567890abcdef
```

Start de site:

```bash
npm run dev
```

Open:

`http://localhost:3000`

---

## 6. Vercel uitleg uitgebreid

### Stap A — GitHub repository maken

Vercel werkt het makkelijkst als je project in GitHub staat.

1. Ga naar `https://github.com`
2. Maak een nieuwe repository, bijvoorbeeld `jose-marchal-website`
3. Upload alle bestanden uit deze map naar die repository

Je kunt dit via GitHub Desktop doen of via de browser met `Add file` → `Upload files`.

Zorg dat `package.json` in de hoofdmap van de repository staat.

### Stap B — Nieuw Vercel project maken

1. Ga naar `https://vercel.com`
2. Log in
3. Klik op `Add New...`
4. Klik op `Project`
5. Kies je GitHub repository `jose-marchal-website`
6. Klik op `Import`

Vercel herkent automatisch dat dit een Next.js project is.

De standaardinstellingen zijn goed:

- Framework Preset: `Next.js`
- Build Command: `next build`
- Output Directory: leeg laten
- Install Command: `npm install`

### Stap C — Environment Variables invullen

Voordat je op deploy klikt, voeg je de Notion keys toe.

Klik in Vercel bij het importeren op:

`Environment Variables`

Voeg toe:

Naam:

`NOTION_TOKEN`

Waarde:

`secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

Klik op `Add`.

Voeg daarna toe:

Naam:

`NOTION_DATABASE_ID`

Waarde:

`1234567890abcdef1234567890abcdef`

Klik op `Add`.

Belangrijk: zet deze variabelen minimaal aan voor `Production`. Meestal selecteert Vercel automatisch Production, Preview en Development. Dat is prima.

### Stap D — Deployen

Klik op:

`Deploy`

Vercel gaat nu:

1. dependencies installeren
2. de Next.js site builden
3. de site publiceren

Na afloop krijg je een URL zoals:

`https://jose-marchal-website.vercel.app`

### Stap E — Controleren of Notion werkt

Open je Vercel URL.

Als je je eigen Notion concerten ziet, werkt alles.

Als je demo-concerten ziet, controleer dan:

1. Staat `NOTION_TOKEN` goed in Vercel?
2. Staat `NOTION_DATABASE_ID` goed in Vercel?
3. Is de database gedeeld met de Notion integration via `Connections`?
4. Heeft minimaal één concert `Gepubliceerd` aangevinkt?
5. Heeft het concert een ingevulde `Datum`?
6. Zijn de propertynamen exact hetzelfde als in deze README?

### Stap F — Na wijzigen van environment variables opnieuw deployen

Als je in Vercel later iets verandert bij Environment Variables, moet je opnieuw deployen.

1. Ga in Vercel naar je project
2. Klik op `Deployments`
3. Klik bij de laatste deployment op de drie puntjes `...`
4. Kies `Redeploy`
5. Kies `Use existing Build Cache` mag aan blijven
6. Klik `Redeploy`

---

## 7. Concert toevoegen in Notion

1. Open de Notion database `Concerten`
2. Klik op `New`
3. Vul de velden in
4. Zet `Gepubliceerd` aan
5. Vul een unieke `Slug` in, bijvoorbeeld `kerstconcert-amersfoort`
6. Wacht maximaal ongeveer 5 minuten
7. Het concert staat op de website

De site gebruikt `revalidate = 300`, dus Vercel ververst de data ongeveer elke 5 minuten.

---

## 8. Veelvoorkomende fouten

### Ik zie geen concerten

Waarschijnlijk is `Gepubliceerd` niet aangevinkt, of is de database niet gedeeld met de integration.

### Ik zie nog demo-concerten

Dan ontbreken de environment variables, of Vercel heeft nog niet opnieuw gedeployed na het toevoegen ervan.

### De detailpagina werkt niet

Controleer of de `Slug` exact overeenkomt met de URL. Gebruik alleen kleine letters, cijfers en streepjes.

Goed:

`bachconcert-dordrecht`

Niet ideaal:

`Bachconcert Dordrecht!`

### Afbeelding werkt niet

Gebruik bij voorkeur een afbeelding in `Hero Afbeelding`. Als die leeg is, gebruikt de site automatisch de standaard achtergrondafbeelding.

---

## 9. Projectstructuur

```txt
app/
  page.js
  layout.js
  globals.css
  concert/[slug]/page.js
lib/
  notion.js
public/assets/
  Background_josemarchal.png
  foreground_josemarchal.png
  Biography_V1.png
  Biography_V2.png
```

## Laatste design-aanpassing

De hero is opnieuw dichter tegen het originele design gezet:

- minder hoge hero-container, niet schermvullend
- foreground-afbeelding kleiner en lager gecentreerd
- ticker in uppercase, langzamer en achter de foreground-laag
- label `DIRIGENTE & ALT` lager/rechts geplaatst met font-weight 500
- label/pijl animatie opvallender gemaakt
- concertpijl roteert bij hover naar horizontaal rechts
