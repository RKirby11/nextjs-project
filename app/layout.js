import './globals.css'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-montserrat'
})

export const metadata = {
    title: 'Test App',
    description: 'Testing Next.js',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${montserrat.variable}`}>
            <body className='font-mono text-offblack'>
                {children}
            </body>
        </html>
    )
}