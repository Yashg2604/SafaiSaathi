import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";
import 'leaflet/dist/leaflet.css';

import Navbar from "@/components/shared/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "SafaiSaathi",
    manifest: "/manifest.json",
    icons: { apple: "/safaisaathi.png" },
    description: "SafaiSaathi isn’t just about recognizing waste. It’s about recognizing value. In trash, in data, and in the people who handle it.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-white text-black max-w-[400px] min-h-screen m-auto`}>
                <Toaster position="top-left" />
                <NextTopLoader color="#008000" initialPosition={0.08} crawlSpeed={200} height={3} crawl={true} easing="ease" speed={200} zIndex={1600} showAtBottom={false} />
                <Navbar />
                {children}
            </body>
        </html>
    );
}
