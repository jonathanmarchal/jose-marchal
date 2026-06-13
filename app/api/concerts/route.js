import { NextResponse } from 'next/server';
import { getConcerts } from '@/lib/notion';

export const revalidate = 60;

export async function GET() {
  const concerts = await getConcerts();
  return NextResponse.json({ source: process.env.NOTION_TOKEN ? 'notion' : 'fallback', concerts });
}
