import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kailhan Hokstam — hkstm.dev',
    description: 'Personal website of Kailhan Hokstam: software engineer building platforms, products, and interactive web experiences.',
    alternates: {
        canonical: 'https://hkstm.dev',
    },
    openGraph: {
        title: 'Kailhan Hokstam — hkstm.dev',
        description: 'Personal website of Kailhan Hokstam: software engineer building platforms, products, and interactive web experiences.',
        url: 'https://hkstm.dev',
        siteName: 'hkstm.dev',
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'Kailhan Hokstam — hkstm.dev',
        description: 'Personal website of Kailhan Hokstam: software engineer building platforms, products, and interactive web experiences.',
    },
}

export default function RootLayout({children,}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    )
}