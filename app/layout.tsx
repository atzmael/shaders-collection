import '@/global.css'
import { Suspense } from 'react'

export const metadata = {
  title: 'Shaders collection',
  description: 'A minimal website for shaders collection code',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='antialiased'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className='dark-mode'>
        <Suspense>
          {children}
        </Suspense>
      </body>
    </html>
  )
}
