import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "AI WooCommerce Uploader",
    description: "Upload products to WooCommerce using AI",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-gray-50 text-gray-900">
                {children}
            </body>
        </html>
    );
}
