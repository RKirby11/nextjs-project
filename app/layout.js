import './globals.css'

export const metadata = {
    title: 'Test App',
    description: 'Testing Next.js',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}