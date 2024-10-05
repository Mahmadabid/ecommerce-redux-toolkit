// app/api/dummy/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    message: 'Hello, this is a dummy API route!',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(data);
}
