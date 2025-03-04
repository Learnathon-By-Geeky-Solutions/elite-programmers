'use client'

import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {

  return (
    <>
        <main className='dark:h-screen'>{children}</main>
    </>
  );
}