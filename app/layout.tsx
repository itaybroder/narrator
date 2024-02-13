import type { Metadata } from 'next'
import { AvatarProvider } from '@/app/context/AvatarContext';

import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GEZZER PRODUCTIONS',
  description: 'The biggest production company in the world.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com"  />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet"/ >

      </head>
      <body className={inter.className}>
        
          <AvatarProvider>
              {children}
          </AvatarProvider>
        </body>
    </html>
  )
}
