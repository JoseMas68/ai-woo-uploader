import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { SettingsProvider } from "../context/SettingsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AI Woo Uploader",
    description: "Upload products to WooCommerce with AI",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>
                <AuthProvider>
                    <SettingsProvider>
                        {children}
                    </SettingsProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
