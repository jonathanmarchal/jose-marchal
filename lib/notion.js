import { Client } from '@notionhq/client';

const notion = process.env.NOTION_TOKEN
  ? new Client({ auth: process.env.NOTION_TOKEN })
  : null;

const demoConcerts = [
  {
    id: 'demo-1',
    title: 'Bachconcert Dordrecht',
    slug: 'bachconcert-dordrecht',
    date: '2025-11-09',
    time: '14:30 – 17:00',
    location: 'Dordrecht',
    ensemble: 'Laurens Kamerkoor',
    description: 'Een concertprogramma met werken van Johann Sebastian Bach onder leiding van José Marchal-Donkersloot.',
    ticketUrl: '#',
    imageUrl: '/assets/Background_josemarchal.png'
  },
  {
    id: 'demo-2',
    title: 'Festival of Lessons and Carols, Mijnsheerenland',
    slug: 'festival-lessons-carols-mijnsheerenland',
    date: '2025-12-14',
    time: '15:00 – 16:30',
    location: 'Mijnsheerenland',
    ensemble: 'Capella Laurentius',
    description: 'Een sfeervol adventsconcert met koorwerken, lezingen en samenzang.',
    ticketUrl: '#',
    imageUrl: '/assets/Background_josemarchal.png'
  }
];

function plainText(property) {
  if (!property) return '';
  if (property.type === 'title') return property.title.map((item) => item.plain_text).join('');
  if (property.type === 'rich_text') return property.rich_text.map((item) => item.plain_text).join('');
  return '';
}

function urlFromFiles(property) {
  if (!property || property.type !== 'files' || property.files.length === 0) return '';
  const file = property.files[0];
  if (file.type === 'external') return file.external.url;
  if (file.type === 'file') return file.file.url;
  return '';
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function mapConcert(page) {
  const props = page.properties;
  const title = plainText(props.Titel || props.Title) || 'Naamloos concert';
  const slug = plainText(props.Slug) || slugify(title);
  return {
    id: page.id,
    title,
    slug,
    date: (props.Datum || props.Date)?.date?.start || '',
    time: plainText(props.Tijd || props.Time),
    location: plainText(props.Locatie || props.Location),
    ensemble: plainText(props.Ensemble),
    description: plainText(props.Beschrijving || props.Description),
    ticketUrl: (props['Ticket URL'] || props.Tickets)?.url || '',
    imageUrl: urlFromFiles(props['Hero Afbeelding'] || props['Hero Image']) || '/assets/Background_josemarchal.png'
  };
}

export async function getConcerts() {
  if (!notion || !process.env.NOTION_DATABASE_ID) return demoConcerts;

  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      and: [
        { property: 'Gepubliceerd', checkbox: { equals: true } },
        { property: 'Datum', date: { is_not_empty: true } }
      ]
    },
    sorts: [{ property: 'Datum', direction: 'ascending' }]
  });

  return response.results.map(mapConcert);
}

export async function getConcertBySlug(slug) {
  const concerts = await getConcerts();
  return concerts.find((concert) => concert.slug === slug) || null;
}

export function formatDate(dateValue) {
  if (!dateValue) return '';
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(dateValue));
}
