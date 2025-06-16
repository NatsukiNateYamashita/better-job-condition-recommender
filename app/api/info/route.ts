import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Hello from Azure!',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
}
