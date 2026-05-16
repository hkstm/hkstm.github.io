import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kailhan Hokstam — hkstm.dev',
    description: 'Kailhan Hokstam\'s website: software engineer' +
        ' shipping products and ideas.',
    alternates: {
        canonical: 'https://hkstm.dev',
    },
    openGraph: {
        title: 'Kailhan Hokstam — hkstm.dev',
        description: 'Kailhan Hokstam\'s website: software engineer' +
            ' shipping products and ideas.',
        url: 'https://hkstm.dev',
        siteName: 'hkstm.dev',
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'Kailhan Hokstam — hkstm.dev',
        description: 'Kailhan Hokstam\'s website: software engineer' +
            ' shipping products and ideas.',
    },
}

export default function RootLayout({children,}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    )
}