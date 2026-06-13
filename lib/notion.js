import fallbackConcerts from '@/data/concerts.json';

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

export function slugify(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function plainText(property) {
  if (!property) return '';
  if (property.type === 'title') return (property.title || []).map((part) => part.plain_text).join('');
  if (property.type === 'rich_text') return (property.rich_text || []).map((part) => part.plain_text).join('');
  if (property.type === 'select') return property.select?.name || '';
  if (property.type === 'multi_select') return (property.multi_select || []).map((item) => item.name).join(', ');
  if (property.type === 'url') return property.url || '';
  if (property.type === 'email') return property.email || '';
  if (property.type === 'phone_number') return property.phone_number || '';
  if (property.type === 'number') return property.number === null ? '' : String(property.number);
  if (property.type === 'checkbox') return property.checkbox;
  if (property.type === 'date') return property.date?.start || '';
  if (property.type === 'formula') {
    const formula = property.formula;
    if (!formula) return '';
    if (formula.type === 'string') return formula.string || '';
    if (formula.type === 'number') return formula.number === null ? '' : String(formula.number);
    if (formula.type === 'boolean') return formula.boolean;
    if (formula.type === 'date') return formula.date?.start || '';
  }
  return '';
}

function fileUrl(property) {
  const file = property?.type === 'files' ? property.files?.[0] : null;
  if (!file) return '';
  if (file.type === 'external') return file.external?.url || '';
  return file.file?.url || '';
}

function prop(properties, names) {
  for (const name of names) {
    if (Object.prototype.hasOwnProperty.call(properties, name)) return properties[name];
  }
  return null;
}

function getPublished(properties) {
  const published = prop(properties, ['Gepubliceerd', 'Published', 'Publiceren']);
  if (!published) return true;
  return plainText(published) !== false;
}

function mapRecord(page) {
  const p = page.properties || {};
  const title = plainText(prop(p, ['Titel', 'Title', 'Concert', 'Naam']));
  const dateValue = plainText(prop(p, ['Datum', 'Date']));
  const startTime = plainText(prop(p, ['Starttijd', 'StartTime', 'Start time', 'Start']));
  const endTime = plainText(prop(p, ['Eindtijd', 'EndTime', 'End time', 'Einde']));
  const ensemble = plainText(prop(p, ['Ensemble', 'Koor', 'Organisatie']));
  const venue = plainText(prop(p, ['Locatie', 'Venue', 'Kerk', 'Zaal']));
  const city = plainText(prop(p, ['Plaats', 'City', 'Stad']));
  const description = plainText(prop(p, ['Beschrijving', 'Description', 'Omschrijving', 'Info']));
  const ticketUrl = plainText(prop(p, ['Ticket URL', 'TicketUrl', 'Tickets', 'Link', 'URL', 'Url']));
  const image = fileUrl(prop(p, ['Afbeelding', 'Hero Afbeelding', 'Image', 'Hero Image']));
  const slugField = plainText(prop(p, ['Slug', 'URL slug']));
  const slug = slugField || slugify(`${title}-${city || venue || dateValue}`);

  return { slug, ensemble, title, date: dateValue, startTime, endTime, venue, city, description, ticketUrl, image };
}

export async function getConcerts() {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!token || !databaseId) {
    return fallbackConcerts;
  }

  const response = await fetch(`${NOTION_API}/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ page_size: 100 }),
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    // Keep the design preview working while env/database permissions are being configured.
    return fallbackConcerts;
  }

  const data = await response.json();
  return (data.results || [])
    .filter((page) => getPublished(page.properties || {}))
    .map(mapRecord)
    .filter((concert) => concert.title && concert.date)
    .sort((a, b) => `${a.date || ''}${a.startTime || ''}`.localeCompare(`${b.date || ''}${b.startTime || ''}`));
}

export async function getConcertBySlug(slug) {
  const concerts = await getConcerts();
  return concerts.find((concert) => concert.slug === slug) || null;
}

export function formatDate(dateValue) {
  if (!dateValue) return '';
  const date = new Date(`${dateValue}T00:00:00`);
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long' }).format(date);
}

export function formatDateLong(dateValue) {
  if (!dateValue) return '';
  const date = new Date(`${dateValue}T00:00:00`);
  return new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export function formatTimeRange(concert) {
  if (concert.startTime && concert.endTime) return `${concert.startTime} – ${concert.endTime}`;
  return concert.startTime || '';
}


export function todayInNetherlands() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Amsterdam',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function isPastConcert(concert, today = todayInNetherlands()) {
  if (!concert?.date) return false;
  return concert.date < today;
}

export function getUpcomingConcerts(concerts, today = todayInNetherlands()) {
  return concerts.filter((concert) => !isPastConcert(concert, today));
}

export function getArchivedConcerts(concerts, today = todayInNetherlands()) {
  return concerts
    .filter((concert) => isPastConcert(concert, today))
    .sort((a, b) => `${b.date || ''}${b.startTime || ''}`.localeCompare(`${a.date || ''}${a.startTime || ''}`));
}
