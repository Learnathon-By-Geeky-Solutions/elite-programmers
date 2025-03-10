'use client';
import { Providers } from './providers';
import '../styles/globals.css';
import React, { useState, useEffect } from 'react';


const applyTheme = (theme: string) => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        const initialTheme = storedTheme || 'light'; 
        setTheme(initialTheme);
        applyTheme(initialTheme);
    },);

    return (
        <html lang="en">
            <body className={theme}>
                <Providers>
                    <main>{children}</main>
                </Providers>
            </body>
        </html>
    );
}