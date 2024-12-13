import './globals.css'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body className={`${poppins.variable} font-sans bg-gradient-to-br from-gray-900 to-black`}>
        {children}
      </body>
    </html>
  )
}
