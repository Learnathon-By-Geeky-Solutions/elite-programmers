'use client'
import { Providers } from './providers'
import NavBar from './navigation-header/NavBar'
import '../styles/globals.css'
import React, { useState,useEffect } from 'react'; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
   
    const [theme, setTheme] = useState('light'); 
    useEffect(() => {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
          setTheme(storedTheme);
          document.body.classList.toggle('dark', storedTheme === 'dark'); 
      }
  }, []); 
    const handleThemeToggle = (newTheme: string) => {
        setTheme(newTheme);
        document.body.classList.toggle('dark', newTheme === 'dark');
    };

    return (
        <html lang="en">
            <body className={theme === 'dark' ? 'dark' : ''}> 
                <Providers>
                   <NavBar onThemeToggle={handleThemeToggle} />
                    <main className='h-screen'>{children}</main> 
                </Providers>
            </body>
        </html>
    )
}