import Link from 'next/link';
import { formatDate, formatTimeRange } from '@/lib/notion';

export default function ConcertList({ concerts }) {
  if (!concerts.length) {
    return <p className="concert-loading">Er zijn nog geen concerten gepubliceerd.</p>;
  }

  return concerts.map((concert) => (
    <Link className="concert-item" href={`/concert/${encodeURIComponent(concert.slug)}`} key={concert.slug}>
      <span className="concert-meta">{concert.ensemble}</span>
      <span className="concert-title">{concert.title}</span>
      <span className="concert-date">{formatDate(concert.date)} | {formatTimeRange(concert)}</span>
      <span className="concert-arrow"><img src="/assets/Arrow.png" alt="" /></span>
    </Link>
  ));
}
