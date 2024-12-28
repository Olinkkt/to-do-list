import './globals.css'
import { Poppins } from 'next/font/google'
import { Viewport } from 'next'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
}

export const metadata = {
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="To-Do List" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ToDo" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${poppins.variable} font-sans bg-gradient-to-br from-gray-900 to-black`}>
        {children}
      </body>
    </html>
  )
}
