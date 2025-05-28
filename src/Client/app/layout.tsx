"use client";

import { Providers } from "@/app/providers";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });

interface PageProps {
    readonly children: React.ReactNode;
}

export default function RootLayout({ children }: PageProps) {
    return (
        <html className={inter.className} lang="en" suppressHydrationWarning>
            <body
                className="bg-[#eeeef0] dark:bg-[#000000]"
                suppressHydrationWarning
            >
                <Providers>{children}</Providers>
                <Toaster position="bottom-right" />
            </body>
        </html>
    );
}
