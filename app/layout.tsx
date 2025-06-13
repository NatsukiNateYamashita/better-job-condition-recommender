import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Better Job Condition Recommender',
  description: 'A tool to help you find better job conditions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
